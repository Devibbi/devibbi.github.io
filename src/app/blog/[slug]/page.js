export const dynamic = 'force-dynamic';

import React from 'react';
import { getBlogPostBySlug } from '../../../utils/contentfulQueries';
import PostDetail from '../../../components/PostDetail';
import { notFound } from 'next/navigation';

// Next.js App Router: async function for server components
export default async function BlogPostPage({ params }) {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) {
        notFound();
    }
    return <PostDetail post={post} />;
}

// Removed generateStaticParams to ensure full dynamic SSR for blog posts.
