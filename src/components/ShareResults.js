import React, { useState, useEffect } from 'react';

const ShareResults = ({ username, score, level, hasHighScore }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [fbSDKLoaded, setFbSDKLoaded] = useState(false);

    // Check if device is mobile for better sharing experience
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Check if Facebook SDK is loaded
    useEffect(() => {
        const checkFbSDK = () => {
            if (window.FB) {
                setFbSDKLoaded(true);
            } else {
                // If not loaded yet, check again in 1 second
                setTimeout(checkFbSDK, 1000);
            }
        };
        checkFbSDK();
    }, []);
    
    // Create more engaging share messages with emojis
    const getShareContent = () => {
        const emoji = level === 'Genius' ? '🧠✨' :
                     level === 'Exceptional' ? '🌟🎯' :
                     level === 'Above Average' ? '💡👏' :
                     level === 'Average' ? '✓👍' : '🔄📈';
        
        const baseMessage = `${emoji} I just took an IQ Test and scored ${score} points!`;
        const achievementMessage = `My result: "${level}" level ${emoji}`;
        const highScoreMessage = hasHighScore ? '\n🏆 This is a new global high score! 🏆' : '';
        const challengeMessage = '\n\nCan you beat my score? Take the test here:';
        
        return {
            base: baseMessage,
            achievement: achievementMessage,
            highScore: highScoreMessage,
            challenge: challengeMessage,
            full: `${baseMessage}\n${achievementMessage}${highScoreMessage}${challengeMessage}`
        };
    };
    
    // Create URLs for different platforms with improved sharing content
    const getShareUrl = (platform) => {
        const content = getShareContent();
        const websiteUrl = encodeURIComponent(window.location.href);
        
        switch (platform) {
            case 'facebook':
                // For Facebook, we'll use the feed dialog instead of share dialog
                return '';
            
            case 'twitter':
                // Twitter has character limits, so use a shorter message
                const twitterText = `${content.base} ${content.achievement}${content.highScore ? ' 🏆' : ''}`;
                return `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${websiteUrl}`;
            
            case 'whatsapp':
                // WhatsApp works well with text + URL
                return `https://api.whatsapp.com/send?text=${encodeURIComponent(content.full + ' ' + decodeURIComponent(websiteUrl))}`;
            
            case 'telegram':
                // Telegram works well with text + URL
                return `https://t.me/share/url?url=${websiteUrl}&text=${encodeURIComponent(content.full)}`;
            
            case 'linkedin':
                // For LinkedIn, we'll use a different approach
                return `https://www.linkedin.com/sharing/share-offsite/?url=${websiteUrl}`;
            
            default:
                return '';
        }
    };
    
    // Handle Facebook share using the SDK with feed dialog instead of share dialog
    const handleFacebookShare = () => {
        const content = getShareContent();
        
        // Use the simpler sharer.php approach which doesn't require app approval
        const sharerUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(content.full)}`;
        window.open(sharerUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
        
        setShowOptions(false);
    };
    
    // Handle LinkedIn share
    const handleLinkedInShare = () => {
        const content = getShareContent();
        
        // Create a temporary textarea element to copy the content
        const textarea = document.createElement('textarea');
        textarea.value = content.full;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Alert the user to paste the content
        alert('Your result has been copied to clipboard. Please paste it into the LinkedIn post after the sharing dialog opens.');
        
        // Open LinkedIn share dialog
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
        setShowOptions(false);
    };
    
    // Handle share click
    const handleShare = (platform) => {
        if (platform === 'facebook') {
            handleFacebookShare();
            return;
        }
        
        if (platform === 'linkedin') {
            handleLinkedInShare();
            return;
        }
        
        const url = getShareUrl(platform);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
        }
        setShowOptions(false);
    };
    
    // Copy to clipboard
    const copyToClipboard = () => {
        const content = getShareContent();
        navigator.clipboard.writeText(content.full + ' ' + window.location.href)
            .then(() => {
                alert('Result copied to clipboard!');
                setShowOptions(false);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
    };
    
    return (
        <div className="relative">
            <button
                onClick={() => setShowOptions(!showOptions)}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 
                        text-white font-bold text-lg shadow-lg hover:shadow-xl 
                        transform transition duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-300
                        flex items-center justify-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Share Results
            </button>
            
            {showOptions && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-0 z-50 animate-fadeIn overflow-hidden">
                    <div className="grid grid-cols-2 gap-0">
                        <button 
                            onClick={() => handleShare('facebook')}
                            className="flex flex-col items-center justify-center p-4 hover:bg-blue-50 transition-colors border-r border-b border-gray-100"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-sm">Facebook</span>
                        </button>
                        
                        <button 
                            onClick={() => handleShare('twitter')}
                            className="flex flex-col items-center justify-center p-4 hover:bg-blue-50 transition-colors border-b border-gray-100"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-sm">Twitter</span>
                        </button>
                        
                        <button 
                            onClick={() => handleShare('whatsapp')}
                            className="flex flex-col items-center justify-center p-4 hover:bg-green-50 transition-colors border-r border-b border-gray-100"
                        >
                            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-sm">WhatsApp</span>
                        </button>
                        
                        <button 
                            onClick={() => handleShare('telegram')}
                            className="flex flex-col items-center justify-center p-4 hover:bg-blue-50 transition-colors border-b border-gray-100"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.5 5.99-4.1-1.34c-.88-.29-.89-.85.2-1.29l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
                                </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-sm">Telegram</span>
                        </button>
                        
                        <button 
                            onClick={() => handleShare('linkedin')}
                            className="flex flex-col items-center justify-center p-4 hover:bg-blue-50 transition-colors border-r border-gray-100"
                        >
                            <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                                </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-sm">LinkedIn</span>
                        </button>
                        
                        <button 
                            onClick={copyToClipboard}
                            className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-sm">Copy Link</span>
                        </button>
                    </div>
                    
                    <div className="border-t border-gray-200">
                        <button 
                            onClick={() => setShowOptions(false)}
                            className="w-full text-center py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareResults;
