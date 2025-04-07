"use client";
import React, { useEffect, useState } from 'react';

const BlogBackground = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Predefined positions and animations for binary elements
    const binaryElements = Array.from({ length: 40 }).map((_, i) => ({
        left: `${(i * 2.5) % 100}%`,
        top: `-50px`,
        animationDelay: `${(i * 0.4) % 15}s`,
        animationDuration: `${10 + (i * 0.2) % 15}s`,
        opacity: 0.1 + (i * 0.005) % 0.3,
        fontSize: `${10 + (i % 18)}px`,
        value: i % 2 === 0 ? '1' : '0'
    }));

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
            {mounted && (
                <div className="absolute inset-0 z-[0] pointer-events-none dark:block hidden">
                    {binaryElements.map((element, i) => (
                        <div
                            key={`binary-${i}`}
                            className="binary-element absolute text-opacity-20 font-mono font-bold animate-binary-fall"
                            style={{
                                left: element.left,
                                top: element.top,
                                animationDelay: element.animationDelay,
                                animationDuration: element.animationDuration,
                                opacity: element.opacity,
                                fontSize: element.fontSize,
                            }}
                        >
                            {element.value}
                        </div>
                    ))}
                </div>
            )}

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

                .animate-binary-fall {
                    animation: binary-fall 15s linear infinite;
                }

                .binary-element {
                    color: rgba(78, 255, 128, 0.7);
                    text-shadow: 0 0 5px rgba(78, 255, 128, 0.5);
                }
            `}</style>
        </>
    );
};

export default BlogBackground;
