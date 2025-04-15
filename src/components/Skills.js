'use client'
// Skills.js
import React, { useEffect, useState } from "react";
import { getAllSkills } from '../utils/contentfulQueries';
import SkillsBackground from "./SkillsBackground";
import SectionBinaryBackground from "./SectionBinaryBackground";

const Skills = () => {
    const [skillsData, setSkillsData] = useState([]);

    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skills = await getAllSkills();
                setSkillsData(Array.isArray(skills) ? skills : []);
            } catch (error) {
                console.error("Error fetching skills:", error);
                setSkillsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!skillsData || skillsData.length === 0) {
        return <div className="text-gray-400 text-sm text-center py-8">No skills data available.</div>;
    }

    return (
        <section id="skills" className="min-h-screen relative overflow-hidden py-20 bg-white dark:bg-gray-900">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-blue-50/80 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-700">
                {/* Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Add Binary Background with purple color */}
            <SectionBinaryBackground color="purple" density={0.8} speed={0.7} opacity={0.3} />

            {/* Add SkillsBackground directly in the section */}
            <SkillsBackground />

            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 skill-fade-in">
                        <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 drop-shadow-sm">
                            My Skills & Expertise
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full animate-pulse"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
                            My toolkit for creating exceptional digital experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skillsData.map((category, index) => (
                            <div key={category.fields.category}
                                className="skill-card bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-xl hover:scale-105 group hover:bg-gradient-to-b hover:from-indigo-50 hover:to-white dark:hover:from-gray-700 dark:hover:to-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900/40"
                                style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                                            <span className="text-white font-bold">{index + 1}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                                            {category.fields.category}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {category.fields.skills.map((skill, skillIndex) => (
                                            <div key={skill}
                                                className="skill-item relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-3 rounded-lg text-center shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white dark:hover:from-indigo-600 dark:hover:to-purple-600 hover:scale-105 hover:-rotate-1 font-semibold"
                                                style={{ animationDelay: `${(index * 150) + (skillIndex * 50)}ms` }}>
                                                <span className="skill-text relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                                    {skill}
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skill stats or summary */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="stat-card bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg text-center group hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">{skillsData.length}</div>
                            <div className="text-gray-700 dark:text-gray-300">Skill Categories</div>
                        </div>
                        <div className="stat-card bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg text-center group hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300 hover:scale-105" style={{ animationDelay: "100ms" }}>
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                                {skillsData.reduce((total, category) => total + category.fields.skills.length, 0)}
                            </div>
                            <div className="text-gray-700 dark:text-gray-300">Total Skills</div>
                        </div>
                        <div className="stat-card bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg text-center group hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300 hover:scale-105" style={{ animationDelay: "200ms" }}>
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">5+</div>
                            <div className="text-gray-700 dark:text-gray-300">Years Experience</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS styles as regular CSS classes instead of styled-jsx */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .skill-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                
                .skill-card {
                    opacity: 0;
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .skill-item {
                    opacity: 0;
                    animation: fadeIn 0.6s ease-out forwards;
                }

                .stat-card {
                    opacity: 0;
                    animation: fadeIn 0.8s ease-out forwards;
                    animation-delay: 300ms;
                }
                
                /* Add text shadow to enhance the gradient text visibility */
                .skill-text {
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    font-weight: 600;
                    letter-spacing: 0.01em;
                }
                
                /* Change skill text color on hover to ensure visibility */
                .skill-item:hover .skill-text {
                    background-image: none;
                    color: white;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                }
                `}
            </style>
        </section>
    );
};

export default Skills;