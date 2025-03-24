import React from 'react';

const getSocialIcon = (platform) => {
    const icons = {
        github: '💻',
        twitter: '🐦',
        linkedin: '👔',
        instagram: '📸'
    };
    return icons[platform.toLowerCase()] || '🔗';
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="transform transition-all duration-300 hover:scale-125 hover:text-yellow-300 inline-flex items-center"
        aria-label={label}
    >
        <span className="text-2xl">{icon}</span>
    </a>
);

const SocialLinks = ({ socialLinks, className = "flex items-center gap-4 flex-wrap" }) => {
    if (!socialLinks) return null;

    return (
        <div className={className}>
            {Object.entries(socialLinks).map(([platform, url]) => (
                <SocialLink
                    key={platform}
                    href={url}
                    icon={getSocialIcon(platform)}
                    label={platform}
                />
            ))}
        </div>
    );
};

export default SocialLinks; 