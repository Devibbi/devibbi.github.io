import React from "react";
import { BookOpen } from "lucide-react";

const Blog = () => {
    const posts = [
        {
            title: "Learning HTML5 and CSS3",
            excerpt: "Master the fundamentals of modern web development",
            date: "Feb 16, 2025",
            readTime: "5 min read"
        },
        {
            title: "JavaScript Best Practices",
            excerpt: "Write cleaner, more efficient JavaScript code",
            date: "Feb 15, 2025",
            readTime: "7 min read"
        }
    ];

    return (
        <section id="blog" className="min-h-screen relative">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-gray-50">
                <div className="w-full h-full opacity-10 bg-[linear-gradient(#444_1px,transparent_1px),linear-gradient(to_right,#444_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen size={32} className="text-green-600" />
                        <h2 className="text-3xl md:text-4xl font-bold text-green-700">My Blog</h2>
                    </div>

                    <div className="grid gap-6">
                        {posts.map((post, index) => (
                            <article
                                key={index}
                                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    </div>
                                    <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        →
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mt-2 pt-4 border-t border-gray-100">
                                    <span>{post.date}</span>
                                    <span className="mx-2">•</span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {post.readTime}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;