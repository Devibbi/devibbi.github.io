import React from 'react';
import { getBlogPostBySlug } from '../../../utils/contentfulQueries';
import PostDetail from '../../../components/PostDetail';

// Next.js App Router: async function for server components
export default async function BlogPostPage({ params }) {
    let post = null;
    let error = null;
    try {
        post = await getBlogPostBySlug(params.slug);
    } catch (err) {
        error = err.message || String(err);
    }
    // Optionally log debug info
    // console.log('Blog post data:', post);
    // console.log('Debug info:', { slug: params.slug, error, postExists: !!post, postRaw: post });
    return <PostDetail post={post} />;
}
