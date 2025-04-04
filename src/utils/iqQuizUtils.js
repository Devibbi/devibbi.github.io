import { client } from './contentful';

/**
 * Save an IQ Quiz score to localStorage and send to Contentful via API
 * @param {Object} scoreData - Player score data
 * @param {string} scoreData.playerName - Player's name
 * @param {number} scoreData.score - Player's score
 * @param {string} scoreData.level - Player's achieved level
 * @param {number} scoreData.streak - Player's highest streak
 * @param {number} scoreData.questionsCorrect - Number of questions answered correctly
 * @param {number} scoreData.totalQuestions - Total number of questions
 */
export const saveIQQuizScore = async (scoreData) => {
    try {
        // Only run localStorage operations in the browser
        if (typeof window !== 'undefined') {
            // 1. Save to localStorage
            const existingScores = JSON.parse(localStorage.getItem('iqGameHighScores') || '[]');

            const newScore = {
                name: scoreData.playerName,
                score: scoreData.score,
                level: scoreData.level,
                date: new Date().toISOString(),
                streak: scoreData.streak,
                questionsCorrect: scoreData.questionsCorrect,
                totalQuestions: scoreData.totalQuestions
            };

            // Add to scores, sort by score (highest first), and limit to top 10
            const updatedScores = [...existingScores, newScore]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);

            localStorage.setItem('iqGameHighScores', JSON.stringify(updatedScores));

            // 2. Send to API for Contentful storage
            try {
                const response = await fetch('/api/save-score', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        playerName: scoreData.playerName,
                        score: scoreData.score,
                        level: scoreData.level,
                        date: newScore.date,
                        streak: scoreData.streak,
                        questionsCorrect: scoreData.questionsCorrect,
                        totalQuestions: scoreData.totalQuestions
                    })
                });

                const result = await response.json();

                if (!result.success) {
                    console.warn('Failed to save score to server:', result.error);
                    // Still return success from localStorage save
                }
            } catch (apiError) {
                // Log but don't disrupt user experience if API fails
                console.error('Error saving score to server:', apiError);
            }

            return {
                success: true,
                rank: updatedScores.findIndex(s => s.name === scoreData.playerName && s.score === scoreData.score) + 1
            };
        }
        return { success: true, rank: 1 };
    } catch (error) {
        console.error('Error saving IQ quiz score:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get high scores from localStorage
 * @returns {Array} Array of high scores
 */
export const getIQQuizHighScores = () => {
    try {
        // Check if running in browser
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('iqGameHighScores') || '[]');
        }
        return [];
    } catch (error) {
        console.error('Error getting high scores:', error);
        return [];
    }
};

/**
 * Get the last player name from localStorage
 * @returns {string} Last player name or empty string
 */
export const getLastPlayerName = () => {
    try {
        // Check if running in browser
        if (typeof window !== 'undefined') {
            return localStorage.getItem('iqGameLastPlayer') || '';
        }
        return '';
    } catch (error) {
        console.error('Error getting last player name:', error);
        return '';
    }
}; 