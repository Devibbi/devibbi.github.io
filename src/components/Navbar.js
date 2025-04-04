"use client";
import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [active, setActive] = useState('home');
    const [isMobile, setIsMobile] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Load theme preference from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMenuClick = (section) => {
        setActive(section);
        const element = document.getElementById(section);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.body.classList.toggle('dark', newDarkMode);
        console.log('Dark mode:', newDarkMode);
        console.log('Body classes:', document.body.classList);
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    const navItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'skills', icon: '💡', label: 'Skills' },
        { id: 'blog', icon: '📝', label: 'Blog' },
        { id: 'contact', icon: '📧', label: 'Contact' }
    ];

    return (
        <nav className={`${isMobile ? 'fixed bottom-0 left-0 w-full py-2' : 'fixed top-0 left-0 h-full w-24 py-8'} 
            bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-400 dark:to-gray-900 text-white shadow-xl z-50`}>
            <ul className={`flex ${isMobile ? 'flex-row justify-around' : 'flex-col items-center space-y-8'}`}>
                {navItems.map(({ id, icon, label }) => (
                    <li key={id}
                        onClick={() => handleMenuClick(id)}
                        className={`cursor-pointer transition-all duration-300 hover:scale-110 p-2 
                            ${active === id ? 'text-yellow-300 font-bold' : 'text-white'}
                            ${isMobile ? 'text-center' : 'w-full text-center'}`}>
                        <span className="text-xl mb-1 block">{icon}</span>
                        <span className="text-sm">{label}</span>
                    </li>
                ))}

                {/* Styled Dark Mode Toggle like other nav items */}
                <li
                    onClick={toggleDarkMode}
                    className={`cursor-pointer transition-all duration-300 hover:scale-110 p-2 
                        text-white ${isMobile ? 'text-center' : 'w-full text-center mt-8'}`}
                >
                    <span className="text-xl mb-1 block">{isDarkMode ? '☀️' : '🌙'}</span>
                    <span className="text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;