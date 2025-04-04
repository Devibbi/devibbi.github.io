import React, { useState, useEffect } from 'react';
import { saveIQQuizScore, getIQQuizHighScores, getLastPlayerName } from '../utils/iqQuizUtils';
import { getIQQuizHighScores as getContentfulHighScores } from '../utils/contentfulQueries';

const IQTestGame = () => {
    // Game state management
    const [gameState, setGameState] = useState('welcome'); // welcome, instructions, playing, completed
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [gameQuestions, setGameQuestions] = useState([]);
    const [streak, setStreak] = useState(0);
    const [showStreak, setShowStreak] = useState(false);
    const [streakEffect, setStreakEffect] = useState(false);
    const [difficulty, setDifficulty] = useState('moderate');
    const [highScores, setHighScores] = useState([]);
    const [globalHighScores, setGlobalHighScores] = useState([]);
    const [playerRank, setPlayerRank] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [loadingScores, setLoadingScores] = useState(true);

    // Full question bank
    const allQuestions = [
        {
            question: "If you rearrange the letters 'EINORST', what is the longest word you can create?",
            options: ["NOTARIES", "RELATIONS", "RESOLUTION", "ITERATION"],
            correctAnswer: "NOTARIES",
            explanation: "NOTARIES is an 8-letter word that can be formed using the letters in EINORST.",
            difficulty: "hard"
        },
        {
            question: "Which number logically continues this sequence? 2, 6, 12, 20, __",
            options: ["24", "30", "28", "26"],
            correctAnswer: "30",
            explanation: "The pattern is adding consecutive odd numbers: +4, +6, +8, +10.",
            difficulty: "moderate"
        },
        {
            question: "What is the next logical symbol in this sequence? △, ◇, ☆, __",
            options: ["☐", "○", "✦", "✧"],
            correctAnswer: "○",
            explanation: "The sequence follows the pattern of shapes: triangle, diamond, star, circle.",
            difficulty: "easy"
        },
        {
            question: "Complete the number sequence: 1, 4, 9, 16, 25, __",
            options: ["30", "36", "42", "49"],
            correctAnswer: "36",
            explanation: "These are square numbers: 1², 2², 3², 4², 5², 6² = 36",
            difficulty: "easy"
        },
        {
            question: "If all roses are flowers and some flowers fade quickly, then:",
            options: [
                "All roses fade quickly",
                "Some roses fade quickly",
                "No roses fade quickly",
                "Cannot be determined"
            ],
            correctAnswer: "Cannot be determined",
            explanation: "From the given premises, we can't determine if roses are part of the flowers that fade quickly.",
            difficulty: "moderate"
        },
        {
            question: "What number is missing? 4, 9, 16, 25, __, 49",
            options: ["36", "40", "42", "45"],
            correctAnswer: "36",
            explanation: "These are perfect squares: 2², 3², 4², 5², 6², 7²",
            difficulty: "easy"
        },
        {
            question: "In which direction would you travel if you went from New York to London?",
            options: ["North", "East", "South", "West"],
            correctAnswer: "East",
            explanation: "London is east of New York across the Atlantic Ocean.",
            difficulty: "easy"
        },
        {
            question: "If a car travels at 60 miles per hour, how far will it travel in 1 hour and 15 minutes?",
            options: ["65 miles", "70 miles", "75 miles", "80 miles"],
            correctAnswer: "75 miles",
            explanation: "1 hour and 15 minutes = 1.25 hours. So 60 mph × 1.25 hours = 75 miles.",
            difficulty: "moderate"
        },
        {
            question: "Which word doesn't belong in this group? Apple, Banana, Cherry, Potato",
            options: ["Apple", "Banana", "Cherry", "Potato"],
            correctAnswer: "Potato",
            explanation: "Apple, Banana, and Cherry are fruits, while Potato is a vegetable.",
            difficulty: "easy"
        },
        {
            question: "Solve: 3x + 12 = 24",
            options: ["x = 4", "x = 5", "x = 6", "x = 12"],
            correctAnswer: "x = 4",
            explanation: "3x + 12 = 24 → 3x = 12 → x = 4",
            difficulty: "easy"
        },
        {
            question: "If the day after tomorrow is Wednesday, what day was yesterday?",
            options: ["Sunday", "Monday", "Tuesday", "Thursday"],
            correctAnswer: "Sunday",
            explanation: "If the day after tomorrow is Wednesday, then tomorrow is Tuesday, today is Monday, and yesterday was Sunday.",
            difficulty: "moderate"
        },
        {
            question: "Which pattern completes this sequence? ◯◯△, ◯△◯, △◯◯, ?",
            options: ["◯◯△", "△◯△", "△△◯", "◯△△"],
            correctAnswer: "△△◯",
            explanation: "The pattern cycles through positions. The triangle moves one position to the left each time, wrapping around.",
            difficulty: "hard"
        },
        {
            question: "If 5 workers can build 5 tables in 5 days, how many workers would be needed to build 10 tables in 10 days?",
            options: ["5 workers", "10 workers", "15 workers", "20 workers"],
            correctAnswer: "5 workers",
            explanation: "Each worker builds 1 table in 5 days, so 5 workers can build 10 tables in 10 days (double the time).",
            difficulty: "hard"
        },
        {
            question: "Which number does not belong in this series? 2, 4, 6, 8, 10, 11, 12, 14",
            options: ["2", "8", "11", "14"],
            correctAnswer: "11",
            explanation: "All other numbers in the series are even numbers, while 11 is odd.",
            difficulty: "moderate"
        },
        {
            question: "A is the father of B. B is the daughter of C. D is the mother of A. What is C to D?",
            options: ["Daughter", "Son", "Daughter-in-law", "Mother-in-law"],
            correctAnswer: "Daughter-in-law",
            explanation: "A is B's father. C is B's mother. D is A's mother. So C is A's wife, making C the daughter-in-law of D.",
            difficulty: "hard"
        }
    ];

    // Load high scores and last player name from localStorage and Contentful on mount
    useEffect(() => {
        async function loadData() {
            setLoadingScores(true);
            try {
                // Load high scores from localStorage
                const localScores = getIQQuizHighScores();
                setHighScores(localScores);

                // Load last player name
                const lastPlayer = getLastPlayerName();
                if (lastPlayer) {
                    setUsername(lastPlayer);
                }

                // For now, don't wait for Contentful - this will prevent the initial error
                // We'll load global scores later when they're available
                setGlobalHighScores([]);

                // Set loading to false immediately so UI is responsive
                setLoadingScores(false);

                // Try to load global scores in the background
                setTimeout(async () => {
                    try {
                        console.log('Attempting to load global high scores from Contentful...');
                        const contentfulScores = await getContentfulHighScores();

                        if (contentfulScores && Array.isArray(contentfulScores) && contentfulScores.length > 0) {
                            console.log(`Successfully loaded ${contentfulScores.length} global high scores`);

                            // Format Contentful scores to match local score format
                            const formattedScores = contentfulScores
                                .filter(item => item && item.fields)
                                .map(item => ({
                                    name: item.fields.playerName?.['en-US'] || 'Unknown',
                                    score: item.fields.score?.['en-US'] || 0,
                                    level: item.fields.level?.['en-US'] || 'Average',
                                    date: item.fields.date?.['en-US'] || new Date().toISOString(),
                                    streak: item.fields.streak?.['en-US'] || 0,
                                    isGlobal: true
                                }));

                            setGlobalHighScores(formattedScores);
                        } else {
                            console.log('No global high scores found or Contentful returned empty array');
                        }
                    } catch (contentfulError) {
                        console.error('Failed to load global high scores:', contentfulError);
                        // Don't let Contentful errors crash the app
                    }
                }, 1000); // Delay by 1 second to let the app load first

            } catch (e) {
                console.error('Failed to initialize game data', e);
                // Use default values on error
                setHighScores([]);
                setGlobalHighScores([]);
                setLoadingScores(false);
            }
        }

        loadData();
    }, []);

    // Get combined high scores (local + global)
    const getCombinedHighScores = () => {
        const combined = [...highScores, ...globalHighScores]
            .filter(score => score.name && score.score) // Filter out invalid scores
            .sort((a, b) => b.score - a.score) // Sort by score (highest first)
            .slice(0, 10); // Limit to top 10

        return combined;
    };

    // Initialize the game with random questions
    const initializeGame = () => {
        // Shuffle all questions and pick 5
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        setGameQuestions(shuffled.slice(0, 5));
        setCurrentQuestion(0);
        setScore(0);
        setCompleted(false);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(30);
        setIsTimerActive(true);
        setStreak(0);
        setCorrectAnswers(0);
        setGameState('playing');
    };

    // Start the game after username entry
    const handleStartGame = () => {
        if (!username.trim()) {
            setUsernameError('Please enter your name to begin');
            return;
        }

        setUsernameError('');
        // Save username to localStorage
        localStorage.setItem('iqGameLastPlayer', username.trim());

        // Move to instructions screen
        setGameState('instructions');
    };

    // Begin the actual quiz after instructions
    const handleBeginQuiz = () => {
        initializeGame();
    };

    // Timer functionality
    useEffect(() => {
        let timer;
        if (isTimerActive && timeLeft > 0 && !completed && !showFeedback) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && !showFeedback && !completed) {
            handleTimeUp();
        }

        return () => clearTimeout(timer);
    }, [timeLeft, isTimerActive, showFeedback, completed]);

    const handleTimeUp = () => {
        setShowFeedback(true);
        setIsTimerActive(false);
        setStreak(0); // Reset streak on timeout

        setTimeout(() => {
            if (currentQuestion < gameQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setShowFeedback(false);
                setSelectedAnswer(null);
                setTimeLeft(30);
                setIsTimerActive(true);
            } else {
                setCompleted(true);
            }
        }, 3000);
    };

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);
        setIsTimerActive(false);

        const isCorrect = answer === gameQuestions[currentQuestion].correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
            // Add bonus points for fast answers
            const timeBonus = Math.floor(timeLeft / 5);
            setScore(prev => prev + timeBonus);
            // Track correct answers
            setCorrectAnswers(prev => prev + 1);

            // Increase streak
            const newStreak = streak + 1;
            setStreak(newStreak);

            // Show streak animation for streaks of 2 or more
            if (newStreak >= 2) {
                setShowStreak(true);
                setTimeout(() => setShowStreak(false), 1500);

                // Show streak effect for streak of 3+
                if (newStreak >= 3) {
                    setStreakEffect(true);
                    setTimeout(() => setStreakEffect(false), 1500);
                }
            }
        } else {
            setStreak(0); // Reset streak on wrong answer
        }

        setTimeout(() => {
            if (currentQuestion < gameQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setShowFeedback(false);
                setSelectedAnswer(null);
                setTimeLeft(30);
                setIsTimerActive(true);
            } else {
                setCompleted(true);
            }
        }, 3000);
    };

    const getIQResult = () => {
        // Calculate percentage based on max possible score (including time bonuses)
        // Basic score is 5 points (one per question)
        // Maximum time bonus would be 5 questions × 6 points = 30
        // So theoretical max score is 35, but realistically around 20-25
        const percentageScore = (score / 20) * 100;
        const clampedPercentage = Math.min(percentageScore, 100); // Cap at 100%

        if (clampedPercentage >= 90) {
            return {
                level: "Genius",
                description: "Exceptional cognitive abilities! Your problem-solving skills are extraordinary.",
                color: "from-green-600 to-emerald-400",
                emoji: "🧠✨",
                badge: "genius-badge"
            };
        } else if (clampedPercentage >= 70) {
            return {
                level: "Superior",
                description: "Impressive analytical thinking and quick reasoning skills.",
                color: "from-blue-600 to-cyan-400",
                emoji: "🔍💡",
                badge: "superior-badge"
            };
        } else if (clampedPercentage >= 50) {
            return {
                level: "Above Average",
                description: "Strong logical reasoning with good problem-solving abilities.",
                color: "from-indigo-500 to-purple-400",
                emoji: "🎯✓",
                badge: "above-average-badge"
            };
        } else if (clampedPercentage >= 30) {
            return {
                level: "Average",
                description: "Solid logical reasoning with room for further development.",
                color: "from-yellow-500 to-amber-400",
                emoji: "📊✓",
                badge: "average-badge"
            };
        } else {
            return {
                level: "Developing",
                description: "There's potential for improving your analytical thinking.",
                color: "from-red-500 to-orange-400",
                emoji: "📈⏳",
                badge: "developing-badge"
            };
        }
    };

    const saveScore = async () => {
        const result = getIQResult();
        // Create score data
        const scoreData = {
            playerName: username,
            score: score,
            level: result.level,
            streak: streak,
            questionsCorrect: correctAnswers,
            totalQuestions: gameQuestions.length
        };

        // Save score using utility function
        const saveResult = await saveIQQuizScore(scoreData);

        if (saveResult.success) {
            // Update high scores state and player rank
            setHighScores(getIQQuizHighScores());
            setPlayerRank(saveResult.rank);
        } else {
            console.error('Failed to save score:', saveResult.error);
        }
    };

    const restartGame = () => {
        setGameState('welcome');
    };

    // Welcome Screen Component
    const WelcomeScreen = () => (
        <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border border-blue-400 animate-fadeIn">
            <div className="max-w-md mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">IQ CHALLENGE</h1>
                    <div className="flex justify-center space-x-2 mb-4">
                        {['🧠', '⚡', '🔍', '💡', '🎯'].map((emoji, i) => (
                            <span key={i} className="animate-bounce text-2xl" style={{ animationDelay: `${i * 0.15}s` }}>{emoji}</span>
                        ))}
                    </div>
                    <p className="text-blue-100">Test your intelligence with our brain-teasing quiz!</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-inner mb-6">
                    <h2 className="text-xl font-semibold mb-3">Enter Your Name</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50 mb-2"
                    />
                    {usernameError && <p className="text-yellow-300 text-sm mb-2">{usernameError}</p>}

                    <button
                        onClick={handleStartGame}
                        className="w-full py-3 px-6 mt-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 
                                text-blue-900 font-bold text-lg shadow-lg 
                                transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
                    >
                        Start Challenge
                    </button>
                </div>

                <div className="text-center">
                    <h3 className="font-medium mb-2">Leaderboard</h3>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 max-h-40 overflow-y-auto">
                        {loadingScores ? (
                            <p className="text-blue-200 text-sm py-2">Loading scores...</p>
                        ) : getCombinedHighScores().length > 0 ? (
                            getCombinedHighScores().slice(0, 5).map((entry, index) => (
                                <div key={index} className="flex justify-between py-1 border-b border-white/10 text-sm">
                                    <span>#{index + 1} {entry.name} {entry.isGlobal && <span title="Global score">🌎</span>}</span>
                                    <span>{entry.score} pts</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-blue-200 text-sm py-2">No scores yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Instructions Screen Component
    const InstructionsScreen = () => (
        <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl border border-indigo-400 animate-fadeIn">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">How to Play</h1>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-inner mb-6">
                    <div className="mb-4 flex items-start">
                        <div className="bg-yellow-500 text-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                        <p>You'll face 5 questions of varying difficulties. Each correct answer earns you points.</p>
                    </div>

                    <div className="mb-4 flex items-start">
                        <div className="bg-yellow-500 text-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                        <p>Answer quickly for bonus points! Each question has a 30-second timer.</p>
                    </div>

                    <div className="mb-4 flex items-start">
                        <div className="bg-yellow-500 text-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                        <p>Build a streak of correct answers for special effects and bragging rights!</p>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-yellow-500 text-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                        <p>At the end, you'll receive an IQ assessment based on your performance.</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleBeginQuiz}
                        className="py-3 px-8 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500
                                text-blue-900 font-bold text-lg shadow-lg hover:shadow-xl 
                                transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
                    >
                        <div className="flex items-center">
                            <span>Begin Challenge</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );

    // Results Screen Component (Refactored)
    const ResultsScreen = () => {
        const result = getIQResult();
        const [hasGlobalHighScore, setHasGlobalHighScore] = useState(false);
        const [globalRank, setGlobalRank] = useState(null);

        // Calculate global rank
        useEffect(() => {
            // Create a combined score array with the current score
            const combinedScores = [
                ...getCombinedHighScores(),
                { name: username, score, level: result.level, date: new Date().toISOString() }
            ].sort((a, b) => b.score - a.score);

            // Find position of current score
            const position = combinedScores.findIndex(
                s => s.name === username && s.date === combinedScores[combinedScores.length - 1].date
            );

            if (position !== -1) {
                setGlobalRank(position + 1);

                // Check if score is in top 10 globally
                if (position < 10) {
                    setHasGlobalHighScore(true);
                }
            }
        }, []);

        // Save score if not already saved
        useEffect(() => {
            if (completed && gameState === 'completed' &&
                highScores.findIndex(s => s.name === username && s.score === score) === -1) {
                saveScore();
            }
        }, [completed, gameState]);

        return (
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border border-blue-400 animate-slideInUp">
                <h1 className="text-3xl font-bold mb-6 text-center">Your IQ Assessment Results</h1>

                <div className="mb-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-4">
                        <span className="text-5xl">{result.emoji}</span>
                    </div>

                    <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent 
                        mb-2 px-4 py-2 border-b-2 border-opacity-50 animate-pulse">
                        {result.level}
                    </h2>

                    <div className="w-full max-w-xs mb-4 mt-4">
                        <div className="relative pt-1">
                            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-blue-900">
                                <div style={{ width: `${Math.min((score / 20) * 100, 100)}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-400 to-amber-500">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="score-display relative my-4">
                        <div className="flex items-center justify-center">
                            <div className="absolute w-24 h-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
                            <div className="relative z-10 text-4xl font-bold text-white">
                                {score} pts
                            </div>
                        </div>
                    </div>

                    <p className="text-lg text-center max-w-md mt-2 mb-6 text-blue-100">{result.description}</p>

                    {hasGlobalHighScore && (
                        <div className="bg-yellow-500/20 backdrop-blur-sm p-3 rounded-lg mb-4 text-center border border-yellow-400/30 animate-pulse">
                            <p className="text-yellow-300 font-bold">🏆 New Global High Score! 🏆</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
                        {playerRank && (
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                                <div className="stat-title text-xs text-blue-200">Local Rank</div>
                                <div className="stat-value text-xl font-bold text-white">#{playerRank}</div>
                            </div>
                        )}

                        {globalRank && (
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                                <div className="stat-title text-xs text-blue-200">Global Rank</div>
                                <div className="stat-value text-xl font-bold text-white">#{globalRank} 🌎</div>
                            </div>
                        )}
                    </div>

                    <div className="stats grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
                        <div className="stat bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                            <div className="stat-title text-xs text-blue-200">Correct</div>
                            <div className="stat-value text-xl font-bold text-white">{correctAnswers}/{gameQuestions.length}</div>
                        </div>
                        <div className="stat bg-white/10 backdrop-blur-sm p-3 rounded-lg text-center">
                            <div className="stat-title text-xs text-blue-200">Top Streak</div>
                            <div className="stat-value text-xl font-bold text-white">{streak}🔥</div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={restartGame}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 
                                    text-blue-900 font-bold text-lg shadow-lg hover:shadow-xl 
                                    transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
                        >
                            Play Again
                        </button>

                        <button
                            onClick={() => {
                                // Share results (simplified version without requiring navigator.share)
                                alert(`${username} scored ${score} points and achieved the "${result.level}" level in the IQ Test!${hasGlobalHighScore ? ' This is a new global high score!' : ''}`);
                            }}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 
                                    text-white font-bold text-lg shadow-lg hover:shadow-xl 
                                    transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-green-300"
                        >
                            Share Results
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Main Game Rendering
    if (!gameQuestions.length && gameState === 'playing') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Render different screens based on game state
    if (gameState === 'welcome') {
        return <WelcomeScreen />;
    }

    if (gameState === 'instructions') {
        return <InstructionsScreen />;
    }

    if (completed || gameState === 'completed') {
        setGameState('completed');
        return <ResultsScreen />;
    }

    // Game Play Screen (based on existing code)
    const currentQuestionData = gameQuestions[currentQuestion];
    const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
    const difficultyColor =
        currentQuestionData.difficulty === 'easy' ? 'text-green-400' :
            currentQuestionData.difficulty === 'moderate' ? 'text-yellow-400' :
                'text-red-400';

    return (
        <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-xl shadow-lg border border-blue-700 animate-slideInUp relative">
            {/* Player info */}
            <div className="absolute top-2 left-3 text-xs text-blue-300 flex items-center z-20">
                <span className="bg-white/10 backdrop-blur-sm py-1 px-2 rounded-full">
                    Player: {username}
                </span>
            </div>

            {/* Streak effect background */}
            {streakEffect && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 animate-pulse rounded-xl z-0"></div>
            )}

            {/* Streak indicator */}
            {showStreak && (
                <div className="absolute top-4 right-4 animate-bounce z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-1 px-3 rounded-full shadow-lg flex items-center">
                        <span className="mr-1">{streak}</span>
                        <span className="text-lg">🔥</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-800 text-blue-200">
                        Q{currentQuestion + 1}/{gameQuestions.length}
                    </span>
                    <span className={`text-xs font-medium ${difficultyColor}`}>
                        {currentQuestionData.difficulty === 'easy' ? 'Easy' :
                            currentQuestionData.difficulty === 'moderate' ? 'Medium' : 'Hard'}
                    </span>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium px-2 py-1 bg-purple-800/50 text-purple-200 rounded-md">
                        {score} pts
                    </div>

                    <div className="timer flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 
                                     bg-gradient-to-r from-blue-500 to-purple-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                            {timeLeft}s
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-8 relative z-10">
                <h2 className="text-xl font-semibold mb-4 leading-relaxed text-white">{currentQuestionData.question}</h2>

                <div className="timer-bar w-full bg-blue-800 h-2 rounded-full mb-6 overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r transition-all duration-1000 ${timeLeft > 20 ? 'from-green-500 to-teal-500' :
                            timeLeft > 10 ? 'from-yellow-500 to-amber-500' :
                                'from-red-500 to-orange-500 animate-pulse'
                            }`}
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {currentQuestionData.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !showFeedback && handleAnswer(option)}
                            disabled={showFeedback}
                            className={`
                                py-4 px-4 border-2 rounded-lg font-medium transition-all duration-300 relative z-10
                                ${!showFeedback ? 'hover:border-blue-400 hover:bg-blue-800/50 hover:shadow-md transform hover:-translate-y-1' : ''} 
                                ${showFeedback && option === currentQuestionData.correctAnswer
                                    ? 'border-green-500 bg-green-900/30 text-green-300'
                                    : showFeedback && option === selectedAnswer && option !== currentQuestionData.correctAnswer
                                        ? 'border-red-500 bg-red-900/30 text-red-300'
                                        : 'border-blue-700 bg-blue-800/30'}
                                ${selectedAnswer === option ? 'ring-2 ring-blue-400' : ''}
                            `}
                        >
                            <div className="flex items-center">
                                <span className="mr-3 w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-sm">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-left flex-grow">{option}</span>

                                {showFeedback && option === currentQuestionData.correctAnswer && (
                                    <span className="ml-auto text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}

                                {showFeedback && option === selectedAnswer && option !== currentQuestionData.correctAnswer && (
                                    <span className="ml-auto text-red-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {showFeedback && (
                <div className={`p-4 rounded-lg mb-4 animate-fadeIn relative z-10 ${isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                    <div className="flex items-center">
                        <h3 className={`font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                            {isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
                        </h3>
                        {isCorrect && (
                            <div className="ml-auto bg-green-900/50 px-2 py-1 rounded text-xs font-bold text-green-300">
                                +{1 + Math.floor(timeLeft / 5)} pts
                            </div>
                        )}
                    </div>
                    <p className="text-sm mt-1 text-blue-100">{currentQuestionData.explanation}</p>
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-blue-300 mt-4 relative z-10">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Quick answers earn bonus points!</span>
                </div>

                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    <span className="text-orange-400 font-medium">{streak}🔥 streak</span>
                </div>
            </div>
        </div>
    );
};

export default IQTestGame;