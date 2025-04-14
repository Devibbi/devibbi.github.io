import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { saveIQQuizScore, getIQQuizHighScores, getLastPlayerName } from '../utils/iqQuizUtils';
import { getIQQuizHighScores as getContentfulHighScores } from '../utils/contentfulQueries';
import ShareResults from './ShareResults';

const IQTestGame = () => {
    // Use ref to prevent initialization loops
    const initialized = useRef(false);
    
    // Game state management
    const [gameState, setGameState] = useState('welcome');
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
    const scoreSaved = useRef(false);

    // Calculate IQ result based on score
    const getIQResult = useCallback(() => {
        let level, description, emoji;

        if (score >= 18) {
            level = 'Genius';
            description = 'Your cognitive abilities are exceptional! You have a rare level of intelligence that puts you in the top percentile.';
            emoji = '🧠';
        } else if (score >= 15) {
            level = 'Exceptional';
            description = 'Your intelligence is well above average. You demonstrate excellent problem-solving skills and logical thinking.';
            emoji = '🌟';
        } else if (score >= 12) {
            level = 'Above Average';
            description = 'You have strong cognitive abilities and think more quickly than most people. Your logical reasoning is impressive.';
            emoji = '💡';
        } else if (score >= 8) {
            level = 'Average';
            description = 'Your intelligence is on par with the majority of people. You have a good balance of cognitive skills.';
            emoji = '✓';
        } else {
            level = 'Below Average';
            description = 'You may need more practice with logical reasoning and pattern recognition. Keep challenging yourself!';
            emoji = '🔄';
        }

        return { level, description, emoji };
    }, [score]);

    // Full question bank
    const allQuestions = useMemo(() => [
        // Your existing questions array
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
        }
    ], []);

    // Load high scores and last player name from localStorage and Contentful on mount
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        
        const loadData = async () => {
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

                // Set loading to false immediately so UI is responsive
                setGlobalHighScores([]);
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
                    }
                }, 1000);

            } catch (e) {
                console.error('Failed to initialize game data', e);
                setHighScores([]);
                setGlobalHighScores([]);
                setLoadingScores(false);
            }
        };

        loadData();
    }, []);

    // Get high scores from local storage and contentful
    const getHighScores = useCallback(async () => {
        try {
            // Get local scores
            const localScores = JSON.parse(localStorage.getItem('iqTestHighScores') || '[]');
            return localScores.sort((a, b) => b.score - a.score);
        } catch (error) {
            console.error('Error getting high scores:', error);
            return [];
        }
    }, []);

    // Get combined high scores (local + global)
    const getCombinedHighScores = useCallback(() => {
        try {
            const localScores = JSON.parse(localStorage.getItem('iqTestHighScores') || '[]');
            return localScores.sort((a, b) => b.score - a.score).slice(0, 10); // Top 10 scores
        } catch (error) {
            console.error('Error getting combined high scores:', error);
            return [];
        }
    }, []);

    // Save score to local storage and possibly contentful
    const saveScore = useCallback(async () => {
        try {
            const newScore = {
                name: username,
                score,
                level: getIQResult().level,
                date: new Date().toISOString()
            };
            
            // Save to local storage
            const currentScores = JSON.parse(localStorage.getItem('iqTestHighScores') || '[]');
            currentScores.push(newScore);
            currentScores.sort((a, b) => b.score - a.score);
            localStorage.setItem('iqTestHighScores', JSON.stringify(currentScores.slice(0, 50)));
            
            // Try to save to contentful if available
            if (window.contentfulClient && window.contentfulClient.createEntry) {
                try {
                    await window.contentfulClient.createEntry('iqTestScore', {
                        fields: {
                            name: { 'en-US': username },
                            score: { 'en-US': score },
                            level: { 'en-US': getIQResult().level },
                            date: { 'en-US': new Date().toISOString() }
                        }
                    });
                } catch (error) {
                    console.error('Failed to save score to contentful:', error);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error saving score:', error);
            return false;
        }
    }, [username, score]);

    // Initialize the game with random questions
    const initializeGame = useCallback(() => {
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
        setGameState('game');
    }, [allQuestions]);

    // Create a separate Timer component to isolate re-renders
    const Timer = memo(({ timeLeft, isActive, onTimeUp }) => {
        const timerRef = useRef(null);
        const startTimeRef = useRef(Date.now());
        const initialTimeRef = useRef(timeLeft);
        const [displayTime, setDisplayTime] = useState(timeLeft);
        
        useEffect(() => {
            // Reset refs when timeLeft changes from parent (new question)
            initialTimeRef.current = timeLeft;
            startTimeRef.current = Date.now();
            setDisplayTime(timeLeft);
        }, [timeLeft]);
        
        useEffect(() => {
            if (!isActive) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                return;
            }
            
            // Clear any existing interval
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            
            // Start a new interval
            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                const newTimeLeft = Math.max(0, initialTimeRef.current - elapsed);
                
                setDisplayTime(newTimeLeft);
                
                if (newTimeLeft <= 0) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    onTimeUp();
                }
            }, 1000);
            
            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };
        }, [isActive, onTimeUp]);
        
        // Calculate color classes based on time left
        const getTimerClasses = () => {
            if (displayTime < 10) return 'text-red-400 animate-pulse';
            return 'text-white';
        };
        
        // Calculate timer bar classes and width
        const getTimerBarClasses = () => {
            if (displayTime > 20) return 'from-green-500 to-teal-500';
            if (displayTime > 10) return 'from-yellow-500 to-amber-500';
            return 'from-red-500 to-orange-500 animate-pulse';
        };
        
        return (
            <>
                <div className="timer flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 
                                bg-gradient-to-r from-blue-500 to-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className={`font-mono font-bold ${getTimerClasses()}`}>
                        {displayTime}s
                    </span>
                </div>
                
                <div className="timer-bar w-full bg-blue-800 h-2 rounded-full mb-6 overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r transition-all duration-1000 ${getTimerBarClasses()}`}
                        style={{ width: `${(displayTime / 30) * 100}%` }}
                    ></div>
                </div>
            </>
        );
    });

    Timer.displayName = 'Timer';

    // Handle timeout/time up
    const handleTimeUp = useCallback(() => {
        if (showFeedback || completed) return;
        
        setShowFeedback(true);
        setIsTimerActive(false);
        setStreak(0);
        setStreakEffect(false);
        
        // Move to next question after delay
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);
            
            if (currentQuestion < gameQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setTimeLeft(30);
                setIsTimerActive(true);
            } else {
                setCompleted(true);
                setGameState('completed');
            }
        }, 3000);
    }, [currentQuestion, gameQuestions.length, showFeedback, completed]);

    // Handle answer selection
    const handleAnswer = useCallback((answer) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);
        setIsTimerActive(false);

        const isCorrect = answer === gameQuestions[currentQuestion].correctAnswer;

        if (isCorrect) {
            // Base score + time bonus
            const timeBonus = Math.floor(timeLeft / 5);
            setScore(prev => prev + 1 + timeBonus);
            setCorrectAnswers(prev => prev + 1);
            
            // Streak handling
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak >= 2) {
                    setShowStreak(true);
                    setTimeout(() => setShowStreak(false), 1500);
                    
                    if (newStreak >= 3) {
                        setStreakEffect(true);
                        setTimeout(() => setStreakEffect(false), 1500);
                    }
                }
                return newStreak;
            });
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            if (currentQuestion < gameQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setShowFeedback(false);
                setSelectedAnswer(null);
                setTimeLeft(30);
                setIsTimerActive(true);
            } else {
                setCompleted(true);
                setGameState('completed');
            }
        }, 3000);
    }, [currentQuestion, gameQuestions, timeLeft]);

    // Auto-save score when game is completed
    useEffect(() => {
        if (gameState === 'completed' && !scoreSaved.current) {
            saveScore();
            scoreSaved.current = true;
        }
    }, [gameState, saveScore]);

    // Enhanced Welcome Screen with all visual features
    const WelcomeScreen = () => {
        const [inputValue, setInputValue] = useState(localStorage.getItem('iqTestUsername') || '');
        const [showError, setShowError] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [highScoreData, setHighScoreData] = useState([]);

        // Load high scores on mount
        useEffect(() => {
            const loadHighScores = async () => {
                setIsLoading(true);
                try {
                    // Use getCombinedHighScores which is synchronous instead of async getHighScores
                    const scores = getCombinedHighScores();
                    setHighScoreData(scores.slice(0, 5)); // Top 5 scores
                } catch (error) {
                    console.error('Failed to load high scores:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            loadHighScores();
        }, []);

        const handleInputChange = (e) => {
            setInputValue(e.target.value);
            if (showError) setShowError(false);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!inputValue.trim()) {
                setShowError(true);
                return;
            }
            setUsername(inputValue.trim());
            localStorage.setItem('iqTestUsername', inputValue.trim());
            setGameState('instructions');
        };

        return (
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border border-blue-400 animate-fadeIn">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mb-4">
                        <span className="text-4xl">🧠</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        IQ Test Challenge
                    </h1>
                    <p className="text-lg text-center max-w-md mb-8 text-blue-100">
                        Test your intelligence with our challenging IQ quiz. Answer questions correctly and quickly to maximize your score!
                    </p>

                    <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                className={`w-full py-4 px-6 bg-white/10 backdrop-blur-sm rounded-lg border-2 
                                    ${showError ? 'border-red-500' : 'border-blue-300'} 
                                    text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400
                                    transition-all duration-300`}
                                maxLength={20}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-yellow-500 to-amber-500 
                                    text-blue-900 font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                Start
                            </button>
                        </div>
                        {showError && (
                            <p className="text-red-400 text-sm mt-2 animate-fadeIn">
                                Please enter your name to continue
                            </p>
                        )}
                    </form>

                    <div className="w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Top Performers
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                            </div>
                        ) : highScoreData.length > 0 ? (
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-blue-700">
                                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-200">Rank</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-200">Name</th>
                                            <th className="py-3 px-4 text-right text-sm font-medium text-blue-200">Score</th>
                                            <th className="py-3 px-4 text-right text-sm font-medium text-blue-200">Level</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {highScoreData.map((score, index) => (
                                            <tr key={index} className="border-b border-blue-800/50 hover:bg-blue-700/20">
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="flex items-center">
                                                        {index === 0 && <span className="mr-1 text-lg">🥇</span>}
                                                        {index === 1 && <span className="mr-1 text-lg">🥈</span>}
                                                        {index === 2 && <span className="mr-1 text-lg">🥉</span>}
                                                        {index > 2 && <span className="mr-1">{index + 1}</span>}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium">{score.name}</td>
                                                <td className="py-3 px-4 text-sm text-right">{score.score}</td>
                                                <td className="py-3 px-4 text-sm text-right">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium
                                                        ${score.level === 'Genius' ? 'bg-purple-800/50 text-purple-200' :
                                                        score.level === 'Exceptional' ? 'bg-blue-800/50 text-blue-200' :
                                                        score.level === 'Above Average' ? 'bg-green-800/50 text-green-200' :
                                                        score.level === 'Average' ? 'bg-yellow-800/50 text-yellow-200' :
                                                        'bg-red-800/50 text-red-200'}
                                                    ">
                                                        {score.level}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                                <p className="text-blue-200">No high scores yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Enhanced Instructions Screen with all visual features
    const InstructionsScreen = () => {
        return (
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border border-blue-400 animate-slideInUp">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mb-4">
                        <span className="text-3xl">📝</span>
                    </div>

                    <h1 className="text-2xl font-bold mb-6 text-center">How to Play</h1>

                    <div className="w-full max-w-lg space-y-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="flex items-start">
                                <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-blue-900 font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-300 mb-1">Answer Questions</h3>
                                    <p className="text-blue-100 text-sm">You'll be presented with {gameQuestions.length} questions of varying difficulty. Select the correct answer from the options provided.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="flex items-start">
                                <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-blue-900 font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-300 mb-1">Beat the Clock</h3>
                                    <p className="text-blue-100 text-sm">You have 30 seconds to answer each question. The faster you answer correctly, the more points you'll earn!</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="flex items-start">
                                <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-blue-900 font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-300 mb-1">Build Your Streak</h3>
                                    <p className="text-blue-100 text-sm">Answer questions correctly in a row to build a streak. Longer streaks earn you bonus points!</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="flex items-start">
                                <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-blue-900 font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-300 mb-1">Get Your IQ Score</h3>
                                    <p className="text-blue-100 text-sm">At the end, you'll receive your IQ assessment based on your performance. Can you reach Genius level?</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => initializeGame()}
                        className="py-4 px-8 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-900 font-bold text-lg rounded-lg
                            shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
                    >
                        Start the Challenge
                    </button>
                </div>
            </div>
        );
    };

    // Enhanced Game Screen with all visual features
    const GameScreen = () => {
        if (!gameQuestions.length) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }
        
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

                        <Timer timeLeft={timeLeft} isActive={isTimerActive} onTimeUp={handleTimeUp} />
                    </div>
                </div>

                <div className="mb-8 relative z-10">
                    <h2 className="text-xl font-semibold mb-4 leading-relaxed text-white">{currentQuestionData.question}</h2>

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
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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

    // Simplified ResultsScreen to fix async issues
    const ResultsScreen = () => {
        const [uiState, setUiState] = useState({
            hasGlobalHighScore: false,
            globalRank: null,
            isLoading: true,
            scoreSaved: false
        });
        const resultRef = useRef(getIQResult());

        // Calculate global rank and save score once on mount
        useEffect(() => {
            let isMounted = true;
            
            const processResults = async () => {
                try {
                    // Calculate rank
                    const combinedScores = [
                        ...getCombinedHighScores(),
                        { name: username, score, level: resultRef.current.level, date: new Date().toISOString() }
                    ].sort((a, b) => b.score - a.score);

                    const position = combinedScores.findIndex(
                        s => s.name === username && s.score === score
                    );

                    if (isMounted) {
                        setUiState(prev => ({
                            ...prev,
                            globalRank: position !== -1 ? position + 1 : null,
                            hasGlobalHighScore: position !== -1 && position < 10,
                            isLoading: false
                        }));
                    }
                } catch (error) {
                    console.error('Error processing results:', error);
                    if (isMounted) {
                        setUiState(prev => ({ ...prev, isLoading: false }));
                    }
                }
            };

            processResults();

            return () => {
                isMounted = false;
            };
        }, []);

        if (uiState.isLoading) {
            return (
                <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border border-blue-400 animate-fadeIn">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
                        <p className="text-blue-100">Calculating your results...</p>
                    </div>
                </div>
            );
        }

        const { hasGlobalHighScore, globalRank } = uiState;
        const result = resultRef.current;

        return (
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl border border-blue-400 animate-slideInUp">
                <h1 className="text-3xl font-bold mb-6 text-center">Your IQ Assessment Results</h1>

                <div className="mb-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mb-4">
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
                            <p className="text-yellow-300 font-bold">&#x1F3C6; New Global High Score! &#x1F3C6;</p>
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
                                <div className="stat-value text-xl font-bold text-white">#{globalRank} &#x1F30E;</div>
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
                            <div className="stat-value text-xl font-bold text-white">{streak}&#x1F525;</div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => setGameState('welcome')}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 
                                    text-blue-900 font-bold text-lg shadow-lg hover:shadow-xl 
                                    transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-yellow-300"
                        >
                            Play Again
                        </button>

                        <ShareResults 
                            username={username} 
                            score={score} 
                            level={result.level} 
                            hasHighScore={hasGlobalHighScore} 
                        />
                    </div>
                </div>
            </div>
        );
    };

    // Render the appropriate screen based on game state
    return (
        <div className="iq-test-game max-h-[85vh] overflow-y-auto">
            {gameState === 'welcome' && <WelcomeScreen />}
            {gameState === 'instructions' && <InstructionsScreen />}
            {gameState === 'game' && <GameScreen />}
            {gameState === 'completed' && <ResultsScreen />}
        </div>
    );
};

export default IQTestGame;