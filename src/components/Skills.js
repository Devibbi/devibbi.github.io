// Skills.js
import React from "react";

const Skills = () => {
    const skillsData = [
        { name: 'HTML5', level: 90, icon: '🌐' },
        { name: 'CSS3', level: 85, icon: '🎨' },
        { name: 'JavaScript', level: 80, icon: '⚡' },
        { name: 'PHP', level: 75, icon: '🐘' },
        { name: 'SQL', level: 70, icon: '💾' }
    ];

    return (
        <section id="skills" className="min-h-screen relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[linear-gradient(30deg,_#000_12%,_transparent_12.5%,_transparent_87%,_#000_87.5%,_#000),linear-gradient(150deg,_#000_12%,_transparent_12.5%,_transparent_87%,_#000_87.5%,_#000),linear-gradient(30deg,_#000_12%,_transparent_12.5%,_transparent_87%,_#000_87.5%,_#000),linear-gradient(150deg,_#000_12%,_transparent_12.5%,_transparent_87%,_#000_87.5%,_#000),linear-gradient(60deg,_#77777777_25%,_transparent_25.5%,_transparent_75%,_#77777777_75%,_#77777777),linear-gradient(60deg,_#77777777_25%,_transparent_25.5%,_transparent_75%,_#77777777_75%,_#77777777)] bg-[length:80px_140px] bg-[position:0_0,_0_0,_40px_70px,_40px_70px,_0_0,_40px_70px]" />
            </div>

            <div className="relative p-6 md:p-10 bg-gradient-to-b from-white via-white to-transparent">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-8">My Skills</h2>
                    <div className="grid gap-6">
                        {skillsData.map(({ name, level, icon }) => (
                            <div key={name} className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-2">{icon}</span>
                                    <h3 className="text-xl font-semibold">{name}</h3>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full transition-all duration-1000"
                                        style={{ width: `${level}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Skills;