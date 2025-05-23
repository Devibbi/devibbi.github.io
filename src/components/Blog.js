import React from 'react';
import { getAllBlogPosts } from '../utils/contentfulQueries';
import Image from 'next/image';
import BlogBackground from './BlogBackground';
import SectionBinaryBackground from './SectionBinaryBackground';

const Blog = async () => {
    const blogPosts = await getAllBlogPosts();

    // Debug: Log blog posts data structure
    console.log('Blog posts count:', blogPosts?.length || 0);

    // Fallback image when needed
    const fallbackImageUrl = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';

    // Defensive: Ensure blogPosts is always an array
    const safeBlogPosts = Array.isArray(blogPosts) ? blogPosts : [];

    // Filter out posts with dev.to links in the externalUrl
    // Also filter out duplicate slugs (show only the first occurrence)
    const seenSlugs = new Set();
    const filteredBlogPosts = safeBlogPosts.filter(post => {
        const slug = post.fields?.slug || post.slug;
        // If post has an externalUrl and it contains 'dev.to', exclude it
        if (post.fields.externalUrl && post.fields.externalUrl.includes('dev.to')) {
            return false;
        }
        // If we've already seen this slug, skip it (removes duplicates)
        if (seenSlugs.has(slug)) {
            return false;
        }
        seenSlugs.add(slug);
        return true;
    });

    return (
        <section id="blog" className="min-h-screen relative py-20 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-600">
            </div>

            {/* Add BlogBackground directly in the section */}
            <BlogBackground />

            {/* Add Binary Background with pink color */}
            <SectionBinaryBackground color="pink" density={1.1} speed={0.9} opacity={0.35} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent pb-2">
                        Latest Blog Posts
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-2 rounded-full"></div>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 font-light max-w-3xl mx-auto">
                        Insights and tutorials on modern web development, design patterns, and programming best practices.
                    </p>
                </div>

                {filteredBlogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogPosts.map((post, index) => {
                            // Defensive: Fallback for image
                            const imageUrl = post?.fields?.featuredImage?.fields?.file?.url
                                ? (post.fields.featuredImage.fields.file.url.startsWith('http')
                                    ? post.fields.featuredImage.fields.file.url
                                    : `https:${post.fields.featuredImage.fields.file.url}`)
                                : fallbackImageUrl;

                            // Determine if this is an external blog post
                            const isExternalPost = !!post.fields.externalUrl;

                            // Create default tags if none exist
                            let tags = post.fields.tags || [];

                            // Add HTML and CSS tags for the last post about HTML5/CSS3 if it's missing tags
                            if (post.fields.title && post.fields.title.includes('HTML5 and CSS3') && (!tags || tags.length === 0)) {
                                tags = ['HTML', 'CSS'];
                            }

                            return (
                                <article
                                    key={post.sys.id}
                                    className="group relative bg-white dark:bg-gray-700 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col h-full"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                                        <Image
                                            src={imageUrl}
                                            alt={post.fields.title || "Blog post"}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                        {/* External Link Badge */}
                                        {isExternalPost && (
                                            <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                External
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Tags */}
                                        {tags && tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full transition-colors duration-300 hover:bg-purple-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300 line-clamp-2 h-14 leading-tight">
                                            {post.fields.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow text-base leading-relaxed">
                                            {post.fields.excerpt}
                                        </p>

                                        {/* Meta Information */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">{new Date(post.fields.publishDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</span>
                                            </div>
                                        </div>

                                        {/* Read More Link - Now at the bottom of each card */}
                                        <div className="flex justify-center mt-auto">
                                            <a
                                                href={isExternalPost ? post.fields.externalUrl : `/blog/${post.fields.slug}`}
                                                target={isExternalPost ? "_blank" : "_self"}
                                                rel={isExternalPost ? "noopener noreferrer" : ""}
                                                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium"
                                            >
                                                {isExternalPost ? "Read on Dev.to" : "Read More"}
                                                <svg
                                                    className="w-4 h-4 ml-2"
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
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-400 text-sm">No blog posts available.</div>
                )}
            </div>
        </section>
    );
};

export default Blog;