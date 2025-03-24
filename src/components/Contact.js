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
        <section id="contact" className="min-h-screen relative py-20 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
                <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-emerald-600 bg-clip-text text-transparent pb-2">
                        Get in Touch
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    {contactInfo && (
                        <div className="space-y-8">
                            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    {contactInfo.email && (
                                        <div className="flex items-center space-x-4 group">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <a href={`mailto:${contactInfo.email}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                                                    {contactInfo.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {contactInfo.phone && (
                                        <div className="flex items-center space-x-4 group">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <a href={`tel:${contactInfo.phone}`} className="text-gray-700 hover:text-green-600 transition-colors">
                                                    {contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {contactInfo.location && (
                                        <div className="flex items-center space-x-4 group">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <span className="text-gray-700">{contactInfo.location}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {contactInfo.socialLinks && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h4 className="text-lg font-semibold mb-4 text-gray-700">Connect with me</h4>
                                        <SocialLinks
                                            socialLinks={contactInfo.socialLinks}
                                            className="flex items-center gap-6"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contact Form */}
                    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            Send a Message
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-7 peer-focus:text-sm"
                                    >
                                        Name
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-7 peer-focus:text-sm"
                                    >
                                        Email
                                    </label>
                                </div>
                            </div>
                            <div className="relative group">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none peer"
                                    placeholder=" "
                                ></textarea>
                                <label
                                    htmlFor="message"
                                    className="absolute left-4 top-3 text-gray-500 transition-all duration-300 -translate-y-7 text-sm peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-7 peer-focus:text-sm"
                                >
                                    Message
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Send Message
                            </button>
                        </form>

                        {/* Form Status Message */}
                        {formStatus.message && (
                            <div
                                className={`mt-4 p-4 rounded-lg ${formStatus.type === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    } transition-all duration-300`}
                            >
                                {formStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-float-delayed"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl animate-float"></div>
            </div>
        </section>
    );
};

export default Contact;