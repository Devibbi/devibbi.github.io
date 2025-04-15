"use client";
import React, { useEffect, useState } from "react";
import { getContactInfo } from '../utils/contentfulQueries';
import SocialLinks from './SocialLinks';
import ContactBackground from "./ContactBackground";
import SectionBinaryBackground from "./SectionBinaryBackground";

const Contact = () => {
    const [contactInfo, setContactInfo] = useState(null);
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [focused, setFocused] = useState({ name: false, email: false, message: false });

    useEffect(() => {
        const fetchContactInfo = async () => {
            const info = await getContactInfo();
            setContactInfo(info?.fields || null);
        };
        fetchContactInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFocus = (field) => {
        setFocused(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        if (!formData[field]) {
            setFocused(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you shortly.' });
            console.log('Form data:', formData);

            // Reset form after submission
            setFormData({ name: '', email: '', message: '' });
            setFocused({ name: false, email: false, message: false });

            setTimeout(() => setFormStatus({ type: '', message: '' }), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            setFormStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        }
    };

    // Defensive: fallback for missing contact info
    const safeContactInfo = contactInfo && typeof contactInfo === 'object' ? contactInfo : {};

    if (!contactInfo) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (Object.keys(safeContactInfo).length === 0) {
        return <div className="text-gray-400 text-sm text-center py-8">No contact information available.</div>;
    }

    return (
        <section id="contact" className="relative min-h-screen py-20 bg-lightblue-50 dark:bg-gradient-to-b dark:from-gray-600 dark:to-gray-500 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-blue-50/80 to-teal-50/80 dark:bg-gradient-to-b dark:from-gray-600 dark:to-gray-500">
                {/* Glow Effects - only visible in light mode */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl dark:opacity-0"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl dark:opacity-0"></div>
            </div>

            {/* Add ContactBackground */}
            <ContactBackground />

            {/* Add Binary Background */}
            <SectionBinaryBackground color="cyan" density={0.9} speed={0.8} opacity={0.4} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 mb-4 drop-shadow-sm dark:from-blue-600 dark:via-teal-600 dark:to-green-600">
                        Let's Connect
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 mx-auto mt-6 rounded-full animate-pulse dark:from-blue-500 dark:to-green-500"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-200 mt-6 max-w-2xl mx-auto">
                        Have a project in mind or just want to say hello? Drop me a message!
                    </p>
                </div>

                {formStatus.message && (
                    <div className={`max-w-2xl mx-auto mb-8 p-6 rounded-xl text-center backdrop-blur-sm shadow-lg border ${formStatus.type === 'success'
                        ? 'bg-green-100/80 text-green-800 border-green-200 dark:bg-green-100/80 dark:text-green-800 dark:border-green-200'
                        : 'bg-red-100/80 text-red-800 border-red-200 dark:bg-red-100/80 dark:text-red-800 dark:border-red-200'
                        } transform transition-all duration-500 animate-slideDown`}>
                        <div className="flex items-center justify-center">
                            <span className={`mr-3 text-2xl ${formStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {formStatus.type === 'success' ? '✅' : '❌'}
                            </span>
                            <p className="font-medium">{formStatus.message}</p>
                        </div>
                    </div>
                )}

                <form className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-700/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-2xl" onSubmit={handleSubmit}>
                    <div className="mb-8 relative">
                        <label
                            className={`absolute left-3 transition-all duration-300 ${focused.name
                                ? 'transform -translate-y-7 text-xs text-indigo-600 dark:text-blue-400 font-semibold'
                                : 'transform translate-y-3 text-gray-500 dark:text-gray-300'
                                }`}
                            htmlFor="name"
                        >
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('name')}
                            onBlur={() => handleBlur('name')}
                            className="w-full p-3 pt-4 pb-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none dark:text-gray-200 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-8 relative">
                        <label
                            className={`absolute left-3 transition-all duration-300 ${focused.email
                                ? 'transform -translate-y-7 text-xs text-indigo-600 dark:text-blue-400 font-semibold'
                                : 'transform translate-y-3 text-gray-500 dark:text-gray-300'
                                }`}
                            htmlFor="email"
                        >
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            className="w-full p-3 pt-4 pb-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none dark:text-gray-200 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-8 relative">
                        <label
                            className={`absolute left-3 transition-all duration-300 ${focused.message
                                ? 'transform -translate-y-7 text-xs text-indigo-600 dark:text-blue-400 font-semibold'
                                : 'transform translate-y-3 text-gray-500 dark:text-gray-300'
                                }`}
                            htmlFor="message"
                        >
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus('message')}
                            onBlur={() => handleBlur('message')}
                            className="w-full p-3 pt-4 pb-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-500 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none resize-none dark:text-gray-200 transition-all duration-300"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 dark:from-blue-600 dark:to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            <span className="mr-2">Send Message</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-0"></div>
                    </button>
                </form>

                {/* Social Links */}
                {safeContactInfo && (
                    <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: "200ms" }}>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600 dark:from-green-500 dark:to-blue-300 mb-6">
                            Connect with Me
                        </h3>
                        <div className="flex justify-center space-x-6">
                            <SocialLinks socialLinks={safeContactInfo.socialLinks} />
                        </div>
                    </div>
                )}
            </div>

            {/* CSS styles for animations */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out forwards;
                }
                `}
            </style>
        </section>
    );
};

export default Contact;