"use client";
import React from 'react';

const SkillsBackground = () => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[0] pointer-events-none dark:hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/40 to-pink-50/40"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

            {/* Actual Visible Tech Icons - More Prominent */}

            {/* React Icon */}
            <div className="tech-icon animate-float absolute top-[15%] left-[8%] w-14 h-14 bg-blue-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-blue-600 text-2xl">⚛️</span>
            </div>

            {/* Node.js Icon */}
            <div className="tech-icon animate-float-delayed absolute top-[75%] left-[15%] w-12 h-12 bg-green-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-green-600 text-xl">🟢</span>
            </div>

            {/* Code Icon */}
            <div className="code-icon animate-float absolute top-[25%] right-[12%] w-16 h-16 bg-purple-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-purple-600 text-2xl">&lt;/&gt;</span>
            </div>

            {/* Database Icon */}
            <div className="db-icon animate-float-delayed absolute top-[65%] right-[18%] w-14 h-14 bg-yellow-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-yellow-600 text-xl">🗄️</span>
            </div>

            {/* Mobile Icon */}
            <div className="tech-icon animate-float absolute top-[20%] left-[48%] w-12 h-12 bg-indigo-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-indigo-600 text-xl">📱</span>
            </div>

            {/* Desktop Icon */}
            <div className="tech-icon animate-float-delayed absolute top-[55%] left-[78%] w-14 h-14 bg-red-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-red-600 text-2xl">🖥️</span>
            </div>

            {/* Rocket Icon */}
            <div className="tech-icon animate-float absolute top-[40%] left-[30%] w-12 h-12 bg-teal-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-teal-600 text-xl">🚀</span>
            </div>

            {/* GraphQL Icon */}
            <div className="db-icon animate-float-delayed absolute top-[85%] left-[60%] w-14 h-14 bg-pink-100 rounded-lg flex justify-center items-center opacity-80 shadow-md -rotate-6">
                <span className="text-pink-600 text-xl">📊</span>
            </div>

            {/* AWS Icon */}
            <div className="db-icon animate-float absolute bottom-[15%] left-[35%] w-16 h-16 bg-orange-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-orange-600 text-2xl">☁️</span>
            </div>

            {/* Gear Icon */}
            <div className="tech-icon animate-float-delayed absolute top-[50%] left-[55%] w-13 h-13 bg-blue-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-12">
                <span className="text-blue-600 text-xl">⚙️</span>
            </div>

            {/* Tool Icon */}
            <div className="tech-icon animate-float absolute top-[30%] left-[70%] w-12 h-12 bg-green-100 rounded-lg flex justify-center items-center opacity-80 shadow-md -rotate-12">
                <span className="text-green-600 text-xl">🔧</span>
            </div>

            {/* Small Code Snippets with better visibility */}
            <div className="code-snippet animate-float-delayed absolute top-[45%] left-[18%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-3 shadow-md">
                <span className="text-gray-800 text-sm font-mono">function()</span>
            </div>

            <div className="code-snippet animate-float absolute top-[80%] left-[45%] bg-gray-100 px-4 py-2 rounded-md opacity-80 -rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">.map()</span>
            </div>

            <div className="code-snippet animate-float-delayed absolute top-[25%] left-[80%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">async/await</span>
            </div>

            {/* Rotating elements - made larger and more visible */}
            <div className="rotate-element animate-rotate-slow absolute w-32 h-32 border-4 border-dashed border-blue-300 rounded-full top-[30%] left-[20%] opacity-60"></div>
            <div className="rotate-element animate-rotate-slow absolute w-40 h-40 border-4 border-dashed border-purple-300 rounded-full top-[60%] left-[65%] opacity-60" style={{ animationDirection: "reverse" }}></div>
            <div className="rotate-element animate-rotate-slow absolute w-28 h-28 border-4 border-dashed border-green-300 rounded-full top-[20%] left-[60%] opacity-60"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer opacity-40"></div>
        </div>
    );
};

export default SkillsBackground;
