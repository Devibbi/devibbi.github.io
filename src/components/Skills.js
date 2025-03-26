// Skills.js
import React from "react";
import { getAllSkills } from '../utils/contentfulQueries';

const Skills = async () => {
    const skillsData = await getAllSkills();

    return (
        <section id="skills" className="min-h-screen relative overflow-hidden py-20 bg-white dark:bg-gray-900">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-700">

            </div>

            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            My Skills & Expertise
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillsData.map((category, index) => (
                            <div key={category.fields.category} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{category.fields.category}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {category.fields.skills.map((skill) => (
                                            <div key={skill} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 p-2 rounded-lg text-center shadow-md transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-500">
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
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