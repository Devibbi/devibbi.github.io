'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPersonalInfo } from '../utils/contentfulQueries';
import SocialLinks from './SocialLinks';
import IQTest from '../components/IQTest';
import ClientLoginButton from './ClientLoginButton';
import SectionBinaryBackground from './SectionBinaryBackground';
import '../globals.css';

const HomePage = () => {
    const [showIQTest, setShowIQTest] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);

    useEffect(() => {
        const fetchInfos = async () => {
            const info = await getPersonalInfo();
            setPersonalInfo(info);
            // Try to get contactInfo for fallback
            try {
                const contact = await import('../utils/contentfulQueries').then(m => m.getContactInfo());
                setContactInfo(contact);
            } catch (e) {
                setContactInfo(null);
            }
        };
        fetchInfos();
    }, []);

    // Defensive extraction with fallback
    const { name = '', title = '', profileImage = null, socialLinks: personalLinks = {} } = personalInfo?.fields || {};
    const { socialLinks: contactLinks = {} } = contactInfo?.fields || {};
    // Fallback: use contactLinks if personalLinks is empty
    const validSocialLinks = (personalLinks && Object.keys(personalLinks).length > 0)
        ? personalLinks
        : (contactLinks && typeof contactLinks === 'object' ? contactLinks : {});
    // Fallback profile image
    const fallbackProfileImage = 'https://www.gravatar.com/avatar/?d=mp&f=y';
    const profileImageUrl = profileImage?.fields?.file?.url
        ? (profileImage.fields.file.url.startsWith('http') ? profileImage.fields.file.url : `https:${profileImage.fields.file.url}`)
        : fallbackProfileImage;

    // Debug logs
    console.log('Profile Image URL:', profileImageUrl);
    console.log('Social Links Data:', validSocialLinks);

    if (!personalInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative animated-background">
            <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 dark:bg-gradient-to-b inset-0 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
                {/* Add section-specific binary background */}
                <SectionBinaryBackground color="blue" density={1.2} speed={1.2} opacity={0.5} />

                <div className="flex flex-col items-center text-center relative z-10">
                    {/* Profile Image */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                        <Image
                            src={profileImageUrl}
                            alt={name || 'Profile'}
                            fill
                            sizes="(max-width: 768px) 192px, 256px"
                            className="rounded-full shadow-2xl border-4 border-white object-cover"
                            priority
                        />
                    </div>

                    {/* Name */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                        {name || 'Loading...'}
                    </h1>

                    {/* Title */}
                    <p className="text-xl md:text-2xl mb-4 text-gray-600 dark:text-gray-300">
                        {title || 'Loading...'}
                    </p>

                    {/* Social links below title - no background */}
                    <div className="mb-10">
                        {Object.keys(validSocialLinks).length > 0 ? (
                            <SocialLinks
                                socialLinks={validSocialLinks}
                                className="flex items-center justify-center gap-6"
                            />
                        ) : (
                            <div className="text-gray-400 text-sm">No social links available</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Action Buttons Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3">
                {/* IQ Test Button */}
                <div className="animate-float">
                    <button
                        onClick={() => setShowIQTest(true)}
                        className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-lg shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center space-x-2 border-2 border-white/30">
                        <span className="relative flex h-6 w-6 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="text-xl">🧠</span>
                        </span>
                        <span className="text-shadow-glow">Test Your IQ</span>
                    </button>
                </div>

                {/* Client Login Button */}
                <div className="animate-float animation-delay-500">
                    <ClientLoginButton />
                </div>
            </div>

            {/* Add a style block for the text glow effect and floating animation */}
            <style jsx>{`
                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5);
                }
                
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
            `}</style>

            {showIQTest && <IQTest onClose={() => setShowIQTest(false)} />}
        </div>
    );
};

export default HomePage;