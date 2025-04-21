import React from 'react';
import { getBlogPostBySlug } from '../../utils/contentfulQueries';
import PostDetail from '../../components/PostDetail';

const BlogPostPage = ({ post, debug }) => {
    // Optional: Debug logging
    if (typeof window !== 'undefined') {
        console.log('Blog post data:', post);
        console.log('Debug info:', debug);
    }
    return <PostDetail post={post} />;
};

export async function getServerSideProps({ params }) {
    let post = null;
    let error = null;
    try {
        post = await getBlogPostBySlug(params.slug);
    } catch (err) {
        error = err.message || String(err);
    }
    return {
        props: {
            post,
            debug: {
                slug: params.slug,
                error,
                postExists: !!post,
                postRaw: post
            }
        },
    };
}

export default BlogPostPage;
