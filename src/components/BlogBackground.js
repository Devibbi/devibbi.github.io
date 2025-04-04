"use client";
import React from 'react';

const BlogBackground = () => {
    return (
        <>
            <div className="absolute top-0 left-0 right-0 bottom-0 z-[0] pointer-events-none dark:hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-pink-50/40 to-blue-50/40"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

                {/* Blog-related Icons */}

                {/* Article Icon */}
                <div className="blog-icon animate-float absolute top-[15%] left-[8%] w-14 h-14 bg-purple-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                    <span className="text-purple-600 text-2xl">📝</span>
                </div>

                {/* Book Icon */}
                <div className="blog-icon animate-float-delayed absolute top-[75%] left-[15%] w-13 h-13 bg-blue-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                    <span className="text-blue-600 text-xl">📚</span>
                </div>
            </div>

            {/* Dark Mode Binary Animation - Only visible in dark mode */}
            <div className="absolute top-0 left-0 right-0 bottom-0 z-[0] pointer-events-none hidden dark:block">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={`binary-${i}`}
                        className={`binary-element absolute text-opacity-20 font-mono font-bold animate-binary-fall`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-50px`,
                            animationDelay: `${Math.random() * 15}s`,
                            animationDuration: `${10 + Math.random() * 15}s`,
                            opacity: 0.1 + Math.random() * 0.3,
                            fontSize: `${Math.floor(10 + Math.random() * 18)}px`,
                        }}
                    >
                        {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                ))}

                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={`stream-${i}`}
                        className="binary-stream absolute font-mono text-xs flex flex-col items-center animate-binary-stream"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-100px`,
                            animationDelay: `${Math.random() * 20}s`,
                            animationDuration: `${15 + Math.random() * 15}s`,
                        }}
                    >
                        {Array.from({ length: Math.floor(5 + Math.random() * 10) }).map((_, j) => (
                            <span
                                key={`stream-${i}-digit-${j}`}
                                className="my-1 animate-binary-pulse"
                                style={{
                                    animationDelay: `${j * 0.2}s`,
                                    opacity: (1 - j * 0.1) > 0.2 ? (1 - j * 0.1) : 0.2
                                }}
                            >
                                {Math.random() > 0.5 ? '1' : '0'}
                            </span>
                        ))}
                    </div>
                ))}

                <style jsx>{`
                    @keyframes binary-fall {
                        0% {
                            transform: translateY(-50px) rotate(0deg);
                            opacity: 0;
                        }
                        10% {
                            opacity: 0.1;
                        }
                        90% {
                            opacity: 0.2;
                        }
                        100% {
                            transform: translateY(calc(100vh + 50px)) rotate(360deg);
                            opacity: 0;
                        }
                    }

                    @keyframes binary-stream {
                        0% {
                            transform: translateY(-100px);
                        }
                        100% {
                            transform: translateY(calc(100vh + 100px));
                        }
                    }

                    @keyframes binary-pulse {
                        0%, 100% {
                            color: rgba(78, 255, 128, 0.4);
                            text-shadow: 0 0 2px rgba(78, 255, 128, 0.2);
                        }
                        50% {
                            color: rgba(78, 255, 128, 0.8);
                            text-shadow: 0 0 8px rgba(78, 255, 128, 0.6);
                        }
                    }

                    .animate-binary-fall {
                        animation: binary-fall 15s linear infinite;
                    }

                    .animate-binary-stream {
                        animation: binary-stream 20s linear infinite;
                    }

                    .animate-binary-pulse {
                        animation: binary-pulse 2s ease-in-out infinite;
                    }

                    .binary-element,
                    .binary-stream {
                        color: rgba(78, 255, 128, 0.7);
                        text-shadow: 0 0 5px rgba(78, 255, 128, 0.5);
                    }
                `}</style>
            </div>
        </>
    );
};

export default BlogBackground;
