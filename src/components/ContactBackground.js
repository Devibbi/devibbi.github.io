"use client";
import React from 'react';

const ContactBackground = () => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[0] pointer-events-none dark:hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-green-50/40 to-teal-50/40"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

            {/* Contact-related Icons */}

            {/* Phone Icon */}
            <div className="contact-icon animate-float absolute top-[15%] left-[8%] w-14 h-14 bg-blue-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-blue-600 text-2xl">📞</span>
            </div>

            {/* Email Icon */}
            <div className="contact-icon animate-float-delayed absolute top-[75%] left-[15%] w-13 h-13 bg-green-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-green-600 text-xl">✉️</span>
            </div>

            {/* Chat Icon */}
            <div className="contact-icon animate-float absolute top-[25%] right-[12%] w-16 h-16 bg-teal-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-teal-600 text-2xl">💬</span>
            </div>

            {/* Location Icon */}
            <div className="contact-icon animate-float-delayed absolute top-[65%] right-[18%] w-14 h-14 bg-indigo-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-indigo-600 text-xl">📍</span>
            </div>

            {/* Social Media Icon */}
            <div className="contact-icon animate-float absolute top-[20%] left-[48%] w-12 h-12 bg-purple-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-purple-600 text-xl">👥</span>
            </div>

            {/* Business Card Icon */}
            <div className="contact-icon animate-float-delayed absolute top-[55%] left-[78%] w-14 h-14 bg-orange-100 rounded-lg flex justify-center items-center opacity-80 shadow-md">
                <span className="text-orange-600 text-xl">📇</span>
            </div>

            {/* Bell Icon */}
            <div className="contact-icon animate-float absolute top-[40%] left-[30%] w-12 h-12 bg-yellow-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-yellow-600 text-xl">🔔</span>
            </div>

            {/* Calendar Icon */}
            <div className="contact-icon animate-float-delayed absolute top-[85%] left-[60%] w-14 h-14 bg-red-100 rounded-lg flex justify-center items-center opacity-80 shadow-md -rotate-6">
                <span className="text-red-600 text-xl">📅</span>
            </div>

            {/* Link Icon */}
            <div className="contact-icon animate-float absolute bottom-[15%] left-[35%] w-13 h-13 bg-pink-100 rounded-lg flex justify-center items-center opacity-80 shadow-md rotate-6">
                <span className="text-pink-600 text-xl">🔗</span>
            </div>

            {/* Small Contact Elements - Removing phone number */}
            <div className="contact-element animate-float-delayed absolute top-[45%] left-[18%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-3 shadow-md">
                <span className="text-gray-800 text-sm font-mono">name@email.com</span>
            </div>

            {/* Replacing phone number with website element */}
            <div className="contact-element animate-float absolute top-[80%] left-[45%] bg-gray-100 px-4 py-2 rounded-md opacity-80 -rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">www.example.com</span>
            </div>

            <div className="contact-element animate-float-delayed absolute top-[25%] left-[80%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-2 shadow-md">
                <span className="text-gray-800 text-sm font-mono">@username</span>
            </div>

            {/* Add a new form-related element */}
            <div className="contact-element animate-float absolute top-[60%] left-[25%] bg-gray-100 px-4 py-2 rounded-md opacity-80 rotate-1 shadow-md">
                <span className="text-gray-800 text-sm font-mono">&lt;form&gt;</span>
            </div>

            {/* Rotating elements */}
            <div className="rotate-element animate-rotate-slow absolute w-32 h-32 border-4 border-dashed border-blue-300 rounded-full top-[30%] left-[20%] opacity-60"></div>
            <div className="rotate-element animate-rotate-slow absolute w-40 h-40 border-4 border-dashed border-green-300 rounded-full top-[60%] left-[65%] opacity-60" style={{ animationDirection: "reverse" }}></div>
            <div className="rotate-element animate-rotate-slow absolute w-28 h-28 border-4 border-dashed border-teal-300 rounded-full top-[20%] left-[60%] opacity-60"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer opacity-40"></div>
        </div>
    );
};

export default ContactBackground;
