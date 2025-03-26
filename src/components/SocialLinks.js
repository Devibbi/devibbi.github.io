import React from 'react';

// Helper function to get social icon based on platform name
const getSocialIcon = (platform) => {
    // Create a unique ID for the Instagram gradient based on a timestamp
    const uniqueId = `instagram-gradient-${Date.now()}`;

    const icons = {
        github: (
            <svg className="w-8 h-8 text-gray-900 hover:text-[#2DBA4E] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        ),
        linkedin: (
            <svg className="w-8 h-8 text-[#0A66C2] hover:text-[#0077B5] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        twitter: (
            <svg className="w-8 h-8 text-[#1DA1F2] hover:text-[#0C86D3] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
        ),
        instagram: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <linearGradient id={uniqueId} x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FED373" />
                    <stop offset="25%" stopColor="#F15245" />
                    <stop offset="50%" stopColor="#D92E7F" />
                    <stop offset="75%" stopColor="#9B36B7" />
                    <stop offset="100%" stopColor="#515ECF" />
                </linearGradient>
                <path fill={`url(#${uniqueId})`} d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
        )
    };

    // Normalize platform name and check if icon exists
    const normalizedPlatform = platform.toLowerCase();
    return icons[normalizedPlatform] || (
        <svg className="w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8284 12L16.2426 13.4142L19.071 10.5858C20.6331 9.02365 20.6331 6.49099 19.071 4.92893C17.509 3.36687 14.9763 3.36687 13.4142 4.92893L10.5858 7.75736L12 9.17157L14.8284 6.34315C15.6095 5.56204 16.8758 5.56204 17.6569 6.34315C18.438 7.12426 18.438 8.39059 17.6569 9.17157L14.8284 12Z M12 14.8284L13.4142 16.2426L10.5858 19.071C9.02365 20.6331 6.49099 20.6331 4.92893 19.071C3.36687 17.509 3.36687 14.9763 4.92893 13.4142L7.75736 10.5858L9.17157 12L6.34315 14.8284C5.56204 15.6095 5.56204 16.8758 6.34315 17.6569C7.12426 18.438 8.39059 18.438 9.17157 17.6569L12 14.8284Z M14.8284 12L12 9.17157L9.17157 12L12 14.8284L14.8284 12Z" />
        </svg>
    );
};

// Get background color for each platform
const getPlatformBgColor = (platform) => {
    const bgColors = {
        github: 'bg-gray-100',
        linkedin: 'bg-blue-50',
        twitter: 'bg-blue-50',
        instagram: 'bg-pink-50'
    };
    return bgColors[platform.toLowerCase()] || 'bg-gray-100';
};

// Individual social link component
const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`transform transition-all duration-300 hover:scale-105 inline-flex items-center justify-center p-2 rounded-md ${getPlatformBgColor(label)} bg-opacity-50 hover:bg-opacity-70 w-10 h-10 shadow-sm hover:shadow-md`}
        aria-label={label}
    >
        {icon}
    </a>
);

// Define hardcoded default links in case data is missing
const DEFAULT_LINKS = {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com"
};

// Generate a unique component key for each instance
let instanceCounter = 0;

const SocialLinks = ({ socialLinks = {}, className = "flex items-center gap-6 flex-wrap" }) => {
    // Increment the instance counter to ensure unique component rendering
    instanceCounter++;
    const instanceId = instanceCounter;

    // Debug the social links data
    console.log(`SocialLinks instance ${instanceId} received:`, socialLinks);

    // If socialLinks is empty or not valid, use default links
    const links = Object.keys(socialLinks).length > 0 ? socialLinks : DEFAULT_LINKS;

    // Early return if still no links
    if (!links || Object.keys(links).length === 0) {
        console.log(`SocialLinks instance ${instanceId}: No links to render, returning null`);
        return null;
    }

    return (
        <div className={className}>
            {Object.entries(links).map(([platform, url]) => (
                <SocialLink
                    key={`${platform}-${instanceId}`}
                    href={url}
                    icon={getSocialIcon(platform)}
                    label={platform}
                />
            ))}
        </div>
    );
};

export default SocialLinks; 