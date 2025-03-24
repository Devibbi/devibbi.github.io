import React from "react";
import Image from 'next/image';
import { getPersonalInfo } from '../utils/contentfulQueries';
import SocialLinks from './SocialLinks';

const HomePage = async () => {
    const personalInfo = await getPersonalInfo();
    const { name, title, profileImage, socialLinks = {} } = personalInfo?.fields || {};

    if (!personalInfo) {
        return <div>Loading...</div>;
    }

    return (
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 md:p-10">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
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
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{name || 'Loading...'}</h1>
                <p className="text-xl md:text-2xl mb-6">{title || 'Loading...'}</p>
                <SocialLinks socialLinks={socialLinks} />
            </div>
        </section>
    );
};

export default HomePage;