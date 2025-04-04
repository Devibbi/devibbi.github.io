"use client";
import React from 'react';

const BlogBackground = () => {
    return (
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

            {/* Idea Icon */}
            <div className="blog-icon animate-float absolute top-[25%] right-[12%] w-16 h-16 bg-yellow-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-yellow-600 text-2xl">💡</span>
            </div>

            {/* Calendar Icon */}
            <div className="blog-icon animate-float-delayed absolute top-[65%] right-[18%] w-14 h-14 bg-green-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-green-600 text-xl">📅</span>
            </div>

            {/* Laptop Icon */}
            <div className="blog-icon animate-float absolute top-[20%] left-[48%] w-12 h-12 bg-indigo-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-indigo-600 text-xl">💻</span>
            </div>

            {/* Newspaper Icon */}
            <div className="blog-icon animate-float-delayed absolute top-[55%] left-[78%] w-14 h-14 bg-pink-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-pink-600 text-2xl">📰</span>
            </div>

            {/* Coffee Icon */}
            <div className="blog-icon animate-float absolute top-[40%] left-[30%] w-12 h-12 bg-orange-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-orange-600 text-xl">☕</span>
            </div>

            {/* Bookmark Icon */}
            <div className="blog-icon animate-float-delayed absolute top-[85%] left-[60%] w-14 h-14 bg-red-100 rounded-lg flex justify-center items-center opacity-80 shadow-md -rotate-6">
                <span className="text-red-600 text-xl">🔖</span>
            </div>

            {/* Tag Icon */}
            <div className="blog-icon animate-float absolute bottom-[15%] left-[35%] w-13 h-13 bg-teal-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-teal-600 text-xl">🏷️</span>
            </div>

            {/* NEW: Search Icon */}
            <div className="blog-icon animate-float-delayed absolute top-[32%] left-[65%] w-12 h-12 bg-blue-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-3">
                <span className="text-blue-600 text-xl">🔍</span>
            </div>

            {/* NEW: Document Icon */}
            <div className="blog-icon animate-float absolute top-[70%] right-[35%] w-13 h-13 bg-indigo-100 rounded-lg flex justify-center items-center opacity-80 shadow-md -rotate-3">
                <span className="text-indigo-600 text-xl">📄</span>
            </div>

            {/* NEW: Camera Icon */}
            <div className="blog-icon animate-float-delayed absolute top-[12%] left-[25%] w-11 h-11 bg-pink-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-pink-600 text-xl">📷</span>
            </div>

            {/* Small Blog Elements */}
            <div className="blog-element animate-float-delayed absolute top-[45%] left-[18%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-3 shadow-md">
                <span className="text-gray-800 text-sm font-mono"># Heading</span>
            </div>

            <div className="blog-element animate-float absolute top-[80%] left-[45%] bg-gray-100 px-4 py-2 rounded-md opacity-80 -rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">![Image]()</span>
            </div>

            <div className="blog-element animate-float-delayed absolute top-[25%] left-[80%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">**Bold**</span>
            </div>

            {/* NEW: More Markdown Elements */}
            <div className="blog-element animate-float absolute top-[60%] left-[20%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-1 shadow-md">
                <span className="text-gray-800 text-sm font-mono">- List item</span>
            </div>

            <div className="blog-element animate-float-delayed absolute top-[35%] right-[25%] bg-gray-100 px-4 py-2 rounded-md opacity-80 -rotate-3 shadow-md">
                <span className="text-gray-800 text-sm font-mono">`code`</span>
            </div>

            <div className="blog-element animate-float absolute top-[68%] right-[15%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">{`> Quote`}</span>
            </div>

            {/* Rotating elements */}
            <div className="rotate-element animate-rotate-slow absolute w-32 h-32 border-4 border-dashed border-purple-300 rounded-full top-[30%] left-[20%] opacity-60"></div>
            <div className="rotate-element animate-rotate-slow absolute w-40 h-40 border-4 border-dashed border-pink-300 rounded-full top-[60%] left-[65%] opacity-60" style={{ animationDirection: "reverse" }}></div>
            <div className="rotate-element animate-rotate-slow absolute w-28 h-28 border-4 border-dashed border-blue-300 rounded-full top-[20%] left-[60%] opacity-60"></div>

            {/* NEW: Additional rotating elements */}
            <div className="rotate-element animate-rotate-slow absolute w-24 h-24 border-4 border-dashed border-indigo-300 rounded-full top-[75%] left-[30%] opacity-60" style={{ animationDuration: "15s" }}></div>
            <div className="rotate-element animate-rotate-slow absolute w-36 h-36 border-4 border-dashed border-teal-300 rounded-full top-[15%] left-[35%] opacity-60" style={{ animationDirection: "reverse", animationDuration: "25s" }}></div>

            {/* NEW: Floating dots */}
            <div className="floating-dot animate-float absolute h-3 w-3 rounded-full bg-purple-400 opacity-60 top-[22%] left-[42%]"></div>
            <div className="floating-dot animate-float-delayed absolute h-2 w-2 rounded-full bg-pink-400 opacity-60 top-[65%] left-[28%]"></div>
            <div className="floating-dot animate-float absolute h-4 w-4 rounded-full bg-blue-400 opacity-60 top-[75%] left-[70%]"></div>
            <div className="floating-dot animate-float-delayed absolute h-3 w-3 rounded-full bg-indigo-400 opacity-60 top-[32%] left-[68%]"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer opacity-40"></div>

            {/* NEW: Additional gradient shimmer in opposite direction */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-100/20 to-transparent animate-shimmer opacity-30" style={{ animationDuration: "15s" }}></div>
        </div>
    );
};

export default BlogBackground; 