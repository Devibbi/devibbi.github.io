import React, { useState } from 'react';

const IQTestGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const questions = [
        {
            question: "If you rearrange the letters 'EINORST', what is the longest word you can create?",
            options: [
                "NOTARIES",
                "RELATIONS",
                "RESOLUTION",
                "ITERATION"
            ],
            correctAnswer: "NOTARIES"
        },
        {
            question: "Which number logically continues this sequence? 2, 6, 12, 20, __",
            options: [
                "24",
                "30",
                "28",
                "26"
            ],
            correctAnswer: "30"
        },
        {
            question: "What is the next logical symbol in this sequence? △, ◇, ☆, __",
            options: [
                "☐",
                "○",
                "✦",
                "✧"
            ],
            correctAnswer: "○"
        }
    ];

    const handleAnswer = (selectedAnswer) => {
        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setCompleted(true);
        }
    };

    const getIQResult = () => {
        const percentageScore = (score / questions.length) * 100;

        if (percentageScore === 100) {
            return {
                level: "Genius",
                description: "Exceptional cognitive abilities! Your problem-solving skills are extraordinary.",
                color: "text-green-600"
            };
        } else if (percentageScore >= 66) {
            return {
                level: "Superior",
                description: "Impressive analytical thinking and quick reasoning skills.",
                color: "text-blue-600"
            };
        } else if (percentageScore >= 33) {
            return {
                level: "Average",
                description: "Solid logical reasoning with room for further development.",
                color: "text-yellow-600"
            };
        } else {
            return {
                level: "Below Average",
                description: "There's potential for improving your analytical thinking.",
                color: "text-red-600"
            };
        }
    };

    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setCompleted(false);
    };

    if (completed) {
        const result = getIQResult();
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h1 className="text-2xl font-bold mb-4 text-center">IQ Test Results</h1>
                <div className={`text-center ${result.color}`}>
                    <h2 className="text-3xl font-bold">{result.level}</h2>
                    <p className="mt-4 text-lg">{result.description}</p>
                    <p className="mt-2 text-xl font-semibold">Score: {score}/{questions.length}</p>
                </div>
                <button
                    onClick={restartGame}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Retry Test
                </button>
            </div>
        );
    }

    const currentQuestionData = questions[currentQuestion];

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-2xl font-bold mb-4 text-center">IQ Challenge</h1>
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">{currentQuestionData.question}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {currentQuestionData.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                </p>
            </div>
        </div>
    );
};

export default IQTestGame;