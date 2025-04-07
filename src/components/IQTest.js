// src/components/IQTest.js
import React, { memo } from 'react';
import IQTestGame from './IQTestGame';

const IQTest = memo(({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative 
                            border-2 border-indigo-500/30 animate-scaleIn dark:text-white">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-yellow-100
                               bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-2 transition-all duration-300 
                               hover:scale-110 shadow-lg border border-white/20 hover:rotate-90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-6 text-center">
                    <div className="flex justify-center mb-3">
                        <span className="text-2xl">🧠</span>
                        <span className="text-2xl ml-2">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                        IQ Assessment Challenge
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-600/10 to-purple-600/10 blur-xl -z-10"></div>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">Discover your cognitive potential with challenging brain teasers</p>
                </div>

                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 animate-pulse"></div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 animate-pulse"
                        style={{ animationDelay: "0.5s" }}></div>

                    <IQTestGame />
                </div>
            </div>
        </div>
    );
});

IQTest.displayName = 'IQTest';
export default IQTest;