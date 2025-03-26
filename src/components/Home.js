import React from "react";
import Image from 'next/image';
import { getPersonalInfo } from '../utils/contentfulQueries';
import SocialLinks from './SocialLinks';

const HomePage = async () => {
    const personalInfo = await getPersonalInfo();
    const { name, title, profileImage, socialLinks = {} } = personalInfo?.fields || {};

    // Debug log to check social links data
    console.log('Social Links Data:', socialLinks);

    if (!personalInfo) {
        return <div>Loading...</div>;
    }

    return (
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 dark:bg-gradient-to-b inset-0 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col items-center text-center ">
                {/* Profile Image */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                    {profileImage && (
                        <Image
                            src={`https:${profileImage.fields.file.url}`}
                            alt={name || 'Profile'}
                            fill
                            sizes="(max-width: 768px) 192px, 256px"
                            className="rounded-full shadow-2xl border-4 border-white object-cover"
                            priority
                        />
                    )}
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
                    <SocialLinks
                        socialLinks={socialLinks}
                        className="flex items-center justify-center gap-6"
                    />
                </div>
            </div>
        </section>
    );
};

export default HomePage;