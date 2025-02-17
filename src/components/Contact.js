"use client";
import React from "react";

const Contact = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        // Add your form submission logic here
        console.log('Form data:', data);
    };

    return (
        <section id="contact" className="min-h-screen relative">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="w-full h-full opacity-5 bg-[linear-gradient(45deg,_#000_25%,_transparent_25%),linear-gradient(-45deg,_#000_25%,_transparent_25%),linear-gradient(45deg,_transparent_75%,_#000_75%),linear-gradient(-45deg,_transparent_75%,_#000_75%)] bg-[length:20px_20px] bg-[position:0_0,_0_10px,_10px_-10px,_-10px_0px]" />
                </div>
            </div>

            <div className="relative p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-8">Contact Me</h2>
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-[1.02]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;