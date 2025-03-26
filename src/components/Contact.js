"use client";
import React, { useEffect, useState } from "react";
import { getContactInfo } from '../utils/contentfulQueries';
import SocialLinks from './SocialLinks';

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
        <section id="contact" className="min-h-screen py-20 bg-lightblue-50 dark:bg-gradient-to-b inset-0 dark:from-gray-500 dark:to-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
                    Get in Touch
                </h2>
                <form className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300" htmlFor="name">Name</label>
                        <input type="text" id="name" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-200" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-200" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300" htmlFor="message">Message</label>
                        <textarea id="message" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-gray-200"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300">
                        Send Message
                    </button>
                </form>

                {/* Social Links */}
                {contactInfo && (
                    <div className="mt-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Connect with Me</h3>
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