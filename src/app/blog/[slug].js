import React from 'react';
import { getBlogPostBySlug } from '../../utils/contentfulQueries';
import Image from 'next/image';
const BlogPost = ({ post }) => {
    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <article className="prose mx-auto p-6">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              width={800} 
              height={450} 
              className="w-full h-auto rounded-lg" 
              unoptimized={true}
            />
            <p className="text-gray-600">{new Date(post.publishDate).toLocaleDateString()}</p>
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
};

export async function getServerSideProps({ params }) {
    const post = await getBlogPostBySlug(params.slug);
    return {
        props: {
            post,
        },
    };
}

export default BlogPost;
