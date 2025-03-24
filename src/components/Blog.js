import React from 'react';
import { getAllBlogPosts } from '../utils/contentfulQueries';
import Image from 'next/image';

const Blog = async () => {
    const blogPosts = await getAllBlogPosts();

    return (
        <section id="blog" className="min-h-screen relative py-20 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent pb-2">
                        Latest Blog Posts
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <article
                            key={post.sys.id}
                            className="group relative bg-white/90 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative h-48 overflow-hidden">
                                {post.fields.featuredImage && (
                                    <Image
                                        src={`https:${post.fields.featuredImage.fields.file.url}`}
                                        alt={post.fields.title}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Category Tag */}
                                {post.fields.category && (
                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
                                        {post.fields.category}
                                    </span>
                                )}

                                {/* Title */}
                                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                                    {post.fields.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.fields.excerpt}
                                </p>

                                {/* Meta Information */}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{new Date(post.fields.publishDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>{post.fields.readTime || '5 min read'}</span>
                                    </div>
                                </div>

                                {/* Read More Link */}
                                <div className="mt-6">
                                    <a
                                        href={`/blog/${post.fields.slug}`}
                                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group"
                                    >
                                        Read More
                                        <svg
                                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Bottom Gradient Bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-1/3 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl animate-float-delayed"></div>
                <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
            </div>
        </section>
    );
};

export default Blog;