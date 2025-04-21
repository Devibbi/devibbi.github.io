import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const PostDetail = ({ post }) => {
    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">404 - Post Not Found</h2>
                <p className="text-lg text-gray-500 mb-8">Sorry, the blog post you are looking for does not exist or has been removed.</p>
                <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium">Go Back Home</a>
            </div>
        );
    }

    // Defensive extraction for Contentful nested fields
    const fields = post.fields || post || {};
    const title = fields.title || '';
    const featuredImage = fields.featuredImage?.fields?.file?.url || fields.featuredImage || '';
    const publishDate = fields.publishDate || '';
    const tags = fields.tags || [];
    const content = fields.content || '';

    // Ensure full image URL
    const imageUrl = featuredImage?.startsWith('http') ? featuredImage : featuredImage ? `https:${featuredImage}` : '';

    // Detect Contentful rich text
    const isRichText = typeof content === 'object' && content.nodeType === 'document';

    if (!title || !content) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h2 className="text-2xl font-bold text-yellow-600 mb-4">Post Data Incomplete</h2>
                <p className="text-base text-gray-500 mb-8">This blog post exists in Contentful, but required fields are missing or not published. Please check the CMS for the following fields:</p>
                <ul className="mb-4 text-left text-gray-700">
                    {!title && <li>- <b>Title</b> is missing</li>}
                    {!content && <li>- <b>Content</b> is missing</li>}
                </ul>
                <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium">Go Back Home</a>
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto my-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
            {imageUrl && (
                <div className="w-full h-72 relative mb-8 rounded-xl overflow-hidden shadow-md">
                    <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
                </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 text-center">{title}</h1>
            <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-500 text-base font-medium">
                    {publishDate ? new Date(publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </span>
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="prose prose-lg dark:prose-invert w-full mt-6">
                {isRichText
                    ? documentToReactComponents(content)
                    : <div dangerouslySetInnerHTML={{ __html: content || '' }} />}
            </div>
        </article>
    );
};

export default PostDetail;
