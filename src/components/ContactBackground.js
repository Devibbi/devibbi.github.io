"use client";
import React from 'react';

const ContactBackground = () => {
    return (
        <>
            <div className="absolute top-0 left-0 right-0 bottom-0 z-[0] pointer-events-none dark:hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-blue-50/40 to-teal-50/40"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

                {/* Contact-related Icons */}

                {/* Phone Icon */}
                <div className="contact-icon animate-float absolute top-[15%] left-[8%] w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50">
                    <span className="text-blue-600 text-2xl">📞</span>
                </div>

                {/* Email Icon */}
                <div className="contact-icon animate-float-delayed absolute top-[75%] left-[15%] w-14 h-14 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-blue-200/50">
                    <span className="text-teal-600 text-xl">✉️</span>
                </div>

                {/* Chat Icon */}
                <div className="contact-icon animate-float absolute top-[25%] right-[12%] w-18 h-18 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-600 text-2xl">💬</span>
                </div>

                {/* Location Icon */}
                <div className="contact-icon animate-float-delayed absolute top-[65%] right-[18%] w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-blue-200/50">
                    <span className="text-blue-600 text-xl">📍</span>
                </div>

                {/* Social Media Icon */}
                <div className="contact-icon animate-float absolute top-[20%] left-[48%] w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-600 text-xl">👥</span>
                </div>

                {/* Business Card Icon */}
                <div className="contact-icon animate-float-delayed absolute top-[55%] left-[78%] w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-blue-200/50">
                    <span className="text-blue-600 text-xl">📇</span>
                </div>

                {/* Bell Icon */}
                <div className="contact-icon animate-float absolute top-[40%] left-[30%] w-14 h-14 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-teal-200/50 rotate-6">
                    <span className="text-teal-600 text-xl">🔔</span>
                </div>

                {/* Calendar Icon */}
                <div className="contact-icon animate-float-delayed absolute top-[85%] left-[60%] w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-indigo-200/50 -rotate-6">
                    <span className="text-indigo-600 text-xl">📅</span>
                </div>

                {/* Link Icon */}
                <div className="contact-icon animate-float absolute bottom-[15%] left-[35%] w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex justify-center items-center opacity-90 shadow-lg border border-blue-200/50 rotate-6">
                    <span className="text-blue-600 text-xl">🔗</span>
                </div>

                {/* Small Contact Elements with actual-looking placeholders */}
                <div className="contact-element animate-float-delayed absolute top-[45%] left-[18%] bg-gradient-to-r from-indigo-100 to-white px-4 py-2 rounded-lg opacity-90 rotate-3 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-800 text-sm font-mono">contact@yourname.dev</span>
                </div>

                {/* Website element */}
                <div className="contact-element animate-float absolute top-[80%] left-[45%] bg-gradient-to-r from-blue-100 to-white px-4 py-2 rounded-lg opacity-90 -rotate-2 shadow-lg border border-blue-200/50">
                    <span className="text-blue-800 text-sm font-mono">www.yourportfolio.com</span>
                </div>

                <div className="contact-element animate-float-delayed absolute top-[25%] left-[80%] bg-gradient-to-r from-teal-100 to-white px-4 py-2 rounded-lg opacity-90 rotate-2 shadow-lg border border-teal-200/50">
                    <span className="text-teal-800 text-sm font-mono">@yourhandle</span>
                </div>

                {/* Form-related element */}
                <div className="contact-element animate-float absolute top-[60%] left-[25%] bg-gradient-to-r from-indigo-100 to-white px-4 py-2 rounded-lg opacity-90 rotate-1 shadow-lg border border-indigo-200/50">
                    <span className="text-indigo-800 text-sm font-mono">&lt;input type="text"/&gt;</span>
                </div>

                {/* Success message element */}
                <div className="contact-element animate-float absolute top-[35%] left-[65%] bg-gradient-to-r from-teal-100 to-white px-4 py-2 rounded-lg opacity-90 -rotate-3 shadow-lg border border-teal-200/50">
                    <span className="text-teal-800 text-sm font-mono">Message sent! ✓</span>
                </div>

                {/* Rotating elements - made larger and more visible */}
                <div className="rotate-element animate-rotate-slow absolute w-36 h-36 border-4 border-dashed border-indigo-300/70 rounded-full top-[30%] left-[20%] opacity-70"></div>
                <div className="rotate-element animate-rotate-slow absolute w-44 h-44 border-4 border-dashed border-blue-300/70 rounded-full top-[60%] left-[65%] opacity-70" style={{ animationDirection: "reverse" }}></div>
                <div className="rotate-element animate-rotate-slow absolute w-32 h-32 border-4 border-dashed border-teal-300/70 rounded-full top-[20%] left-[60%] opacity-70"></div>

                {/* Add sparkle elements */}
                <div className="absolute top-[10%] right-[30%] w-6 h-6 text-xl animate-pulse">✨</div>
                <div className="absolute top-[60%] right-[10%] w-6 h-6 text-xl animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
                <div className="absolute top-[80%] right-[50%] w-6 h-6 text-xl animate-pulse" style={{ animationDelay: "1s" }}>✨</div>
                <div className="absolute top-[40%] right-[80%] w-6 h-6 text-xl animate-pulse" style={{ animationDelay: "1.5s" }}>✨</div>

                {/* Connect lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20%" y1="15%" x2="30%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" />
                    <line x1="30%" y1="40%" x2="48%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1" />
                    <line x1="48%" y1="20%" x2="70%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1" />
                    <line x1="70%" y1="30%" x2="78%" y2="55%" stroke="url(#lineGradient)" strokeWidth="1" />
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#0d9488" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Add a subtle particle effect using a pseudo-element */}
                <div className="particles"></div>

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
                    
                    .particles {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: radial-gradient(circle, #6366f1 1px, transparent 1px),
                                        radial-gradient(circle, #0d9488 1px, transparent 1px);
                        background-size: 30px 30px;
                        background-position: 0 0, 15px 15px;
                        opacity: 0.1;
                    }
                `}</style>
            </div>

            {/* Dark Mode Binary Animation - Only visible in dark mode */}
            <div className="absolute top-0 left-0 right-0 bottom-0 z-[0] pointer-events-none hidden dark:block">
                {/* Binary Numbers */}
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

                {/* Binary Streams */}
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
                    
                    .animate-binary-stream {
                        animation: binary-stream 20s linear infinite;
                    }
                    
                    .animate-binary-pulse {
                        animation: binary-pulse 2s ease-in-out infinite;
                    }
                    
                    .binary-stream {
                        color: rgba(78, 255, 128, 0.7);
                        text-shadow: 0 0 5px rgba(78, 255, 128, 0.5);
                    }
                `}</style>
            </div>
        </>
    );
};

export default ContactBackground;