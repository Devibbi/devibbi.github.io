import React from "react";
import Image from 'next/image';

const HomePage = () => (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 md:p-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                <Image
                    src="/ibbi1.png"
                    alt="Profile Image"
                    fill
                    sizes="(max-width: 768px) 192px, 256px"
                    className="rounded-full shadow-2xl border-4 border-white object-cover"
                    priority
                />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">M. Ibraheem Zaffar</h1>
            <p className="text-xl md:text-2xl mb-6">Front End Engineer</p>
            <div className="flex space-x-6">
                <SocialLink href="https://github.com/Devibbi" icon="💻" label="GitHub" />
                <SocialLink href="https://x.com/devibbi" icon="🐦" label="Twitter" />
                <SocialLink href="https://www.linkedin.com/in/ibraheemzaffar/" icon="👔" label="LinkedIn" />
                <SocialLink href="https://instagram.com/ibbi_125" icon="📸" label="Instagram" />
            </div>
        </div>
    </section>
);

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="transform transition-all duration-300 hover:scale-125 hover:text-yellow-300"
        aria-label={label}
    >
        <span className="text-3xl">{icon}</span>
    </a>
);

export default HomePage;