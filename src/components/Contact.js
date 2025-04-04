"use client";
import React, { useEffect, useState } from "react";
import { getContactInfo } from '../utils/contentfulQueries';
import SocialLinks from './SocialLinks';
import ContactBackground from "./ContactBackground";

const Contact = () => {
    const [contactInfo, setContactInfo] = useState(null);
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchContactInfo = async () => {
            const info = await getContactInfo();
            setContactInfo(info?.fields || null);
        };
        fetchContactInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            setFormStatus({ type: 'success', message: 'Message sent successfully!' });
            console.log('Form data:', data);
            e.target.reset();
            setTimeout(() => setFormStatus({ type: '', message: '' }), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            setFormStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        }
    };

    return (
        <section id="contact" className="relative min-h-screen py-20 bg-lightblue-50 dark:bg-gradient-to-b from-gray-500 to-gray-400">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-green-50/80 to-teal-50/80 dark:bg-gradient-to-b dark:from-gray-500 dark:to-gray-400">
            </div>

            {/* Add ContactBackground */}
            <ContactBackground />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent pb-2 mb-8">
                    Get in Touch
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-10 rounded-full"></div>

                {formStatus.message && (
                    <div className={`mb-6 p-4 rounded-lg text-center ${formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {formStatus.message}
                    </div>
                )}

                <form className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm p-8 rounded-lg shadow-xl" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition duration-300 transform hover:scale-105 font-medium shadow-md"
                    >
                        Send Message
                    </button>
                </form>

                {/* Social Links */}
                {contactInfo && (
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Connect with Me</h3>
                        <div className="flex justify-center space-x-4">
                            <SocialLinks socialLinks={contactInfo.socialLinks} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Contact;