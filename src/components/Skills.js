// Skills.js
import React from "react";
import { getAllSkills } from '../utils/contentfulQueries';

const Skills = async () => {
    const skillsData = await getAllSkills();

    return (
        <section id="skills" className="min-h-screen relative overflow-hidden py-20">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80"></div>
            </div>

            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
                            My Skills & Expertise
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillsData.map((category, index) => (
                            <div
                                key={category.fields.category}
                                className="transform hover:scale-105 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            >
                                <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <span className="text-3xl mr-3 transform group-hover:scale-110 transition-transform duration-300">
                                                {category.fields.icon}
                                            </span>
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                                {category.fields.category}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {category.fields.skills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded-lg text-sm font-medium text-gray-700 hover:from-green-100 hover:to-blue-100 transition-colors duration-300 transform hover:scale-105"
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-1/3 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float-delayed"></div>
                <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float"></div>
            </div>
        </section>
    );
};

export default Skills;