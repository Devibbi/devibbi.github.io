"use client";
import React, { useEffect, useState } from 'react';

const ContactBackground = () => {
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-blue-50/40 to-teal-50/40"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

                {/* Contact-related Icons */}
                <div className="contact-icon animate-float absolute top-[15%] left-[8%] w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50">
                    <span className="text-blue-600 text-2xl">📞</span>
                </div>

                <div className="contact-icon animate-float-delayed absolute top-[75%] left-[15%] w-14 h-14 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-blue-200/50">
                    <span className="text-teal-600 text-xl">✉️</span>
                </div>

                <div className="contact-icon animate-float absolute top-[25%] right-[12%] w-18 h-18 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-600 text-2xl">💬</span>
                </div>

                <div className="contact-icon animate-float-delayed absolute top-[20%] left-[48%] w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-600 text-xl">👥</span>
                </div>

                <div className="contact-icon animate-float absolute top-[55%] left-[78%] w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-blue-200/50">
                    <span className="text-blue-600 text-xl">📇</span>
                </div>

                <div className="contact-icon animate-float absolute top-[40%] left-[30%] w-14 h-14 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-teal-200/50 rotate-6">
                    <span className="text-teal-600 text-xl">🔔</span>
                </div>

                <div className="contact-icon animate-float-delayed absolute top-[85%] left-[60%] w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50 -rotate-6">
                    <span className="text-indigo-600 text-xl">📅</span>
                </div>

                {/* Small Contact Elements */}
                <div className="contact-element animate-float-delayed absolute top-[45%] left-[18%] bg-gradient-to-r from-indigo-100 to-white px-4 py-2 rounded-lg opacity-90 rotate-3 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-800 text-sm font-mono">contact@yourname.dev</span>
                </div>

                <div className="contact-element animate-float absolute top-[95%] left-[45%] bg-gradient-to-r from-blue-100 to-white px-4 py-2 rounded-lg opacity-90 -rotate-2 shadow-lg border border-blue-200/50">
                    <span className="text-blue-800 text-sm font-mono">www.Devibbi.com</span>
                </div>

                <div className="contact-element animate-float-delayed absolute top-[25%] left-[80%] bg-gradient-to-r from-teal-100 to-white px-4 py-2 rounded-lg opacity-90 rotate-2 shadow-lg border border-teal-200/50">
                    <span className="text-teal-800 text-sm font-mono">@yourhandle</span>
                </div>

                <div className="contact-element animate-float absolute top-[60%] left-[25%] bg-gradient-to-r from-indigo-100 to-white px-4 py-2 rounded-lg opacity-90 rotate-1 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-800 text-sm font-mono">&lt;input type="text"/&gt;</span>
                </div>

                {/* Rotating elements */}
                <div className="rotate-element animate-rotate-slow absolute w-36 h-36 border-4 border-dashed border-indigo-300/70 rounded-full top-[30%] left-[20%] opacity-70"></div>
                <div className="rotate-element animate-rotate-slow absolute w-44 h-44 border-4 border-dashed border-blue-300/70 rounded-full top-[60%] left-[65%] opacity-70" style={{ animationDirection: "reverse" }}></div>
                <div className="rotate-element animate-rotate-slow absolute w-32 h-32 border-4 border-dashed border-teal-300/70 rounded-full top-[20%] left-[60%] opacity-70"></div>

                {/* Sparkle elements */}
                <div className="absolute top-[10%] right-[30%] w-6 h-6 text-xl animate-pulse">✨</div>
                <div className="absolute top-[60%] right-[10%] w-6 h-6 text-xl animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
                <div className="absolute top-[80%] right-[50%] w-6 h-6 text-xl animate-pulse" style={{ animationDelay: "1s" }}>✨</div>
                <div className="absolute top-[40%] right-[80%] w-6 h-6 text-xl animate-pulse" style={{ animationDelay: "1.5s" }}>✨</div>
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
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float 5s ease-in-out infinite;
                    animation-delay: 1s;
                }
                
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .animate-rotate-slow {
                    animation: rotate-slow 20s linear infinite;
                }

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

export default ContactBackground;