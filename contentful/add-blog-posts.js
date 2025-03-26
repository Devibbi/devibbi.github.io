require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if contentful-management is installed
try {
    require.resolve('contentful-management');
    console.log('contentful-management is already installed.');
} catch (e) {
    console.log('Installing contentful-management...');
    try {
        execSync('npm install contentful-management --save-dev', { stdio: 'inherit' });
        console.log('contentful-management installed successfully.');
    } catch (err) {
        console.error('Failed to install contentful-management:', err);
        process.exit(1);
    }
}

const contentful = require('contentful-management');

async function addBlogPosts() {
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN || !process.env.CONTENTFUL_SPACE_ID) {
        console.error('Missing environment variables. Make sure CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID are set in your .env.local file.');
        process.exit(1);
    }

    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    try {
        console.log('Connecting to Contentful...');
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment('master');
        console.log('Connected to Contentful successfully.');

        // Blog posts from dev.to
        const blogPosts = [
            {
                title: 'Comparing SASS with plain CSS',
                slug: 'comparing-sass-with-plain-css',
                excerpt: 'A comparison between SASS and plain CSS, discussing the advantages and use cases for each.',
                externalUrl: 'https://dev.to/devibbi/comparing-sass-with-plain-css-2ld0',
                publishDate: '2024-11-01',
                tags: ['CSS', 'SASS', 'Web Development', 'Frontend']
            },
            {
                title: 'How I created Inspirational Homepage Using React/Redux JS',
                slug: 'inspirational-homepage-react-redux',
                excerpt: 'A detailed walkthrough of creating an inspirational homepage using React and Redux.',
                externalUrl: 'https://dev.to/devibbi/how-i-created-inspirational-homepage-using-reactredux-js-g89',
                publishDate: '2024-10-07',
                tags: ['React', 'Redux', 'JavaScript', 'Web Development']
            },
            {
                title: 'How I created Weather App using React JS',
                slug: 'weather-app-react-js',
                excerpt: 'A step-by-step guide to creating a weather application using React JS.',
                externalUrl: 'https://dev.to/devibbi/how-i-created-weather-app-using-react-js-3m3c',
                publishDate: '2024-09-30',
                tags: ['React', 'JavaScript', 'API', 'Weather App']
            },
            {
                title: 'How I created A Spotify Clone App using React JS',
                slug: 'spotify-clone-react-js',
                excerpt: 'An in-depth look at building a Spotify clone application with React JS.',
                externalUrl: 'https://dev.to/devibbi/how-i-created-a-spotify-clone-app-using-react-js-40ga',
                publishDate: '2024-09-23',
                tags: ['React', 'JavaScript', 'Spotify', 'Clone App']
            }
        ];

        // Create a default placeholder image first
        let placeholderAsset;
        try {
            // Check if we already have a placeholder image
            const assets = await environment.getAssets();
            placeholderAsset = assets.items.find(asset =>
                asset.fields && asset.fields.title &&
                asset.fields.title['en-US'] === 'Blog Placeholder Image'
            );

            if (!placeholderAsset) {
                console.log('Creating placeholder image asset...');
                // Create a new placeholder image
                placeholderAsset = await environment.createAsset({
                    fields: {
                        title: {
                            'en-US': 'Blog Placeholder Image'
                        },
                        description: {
                            'en-US': 'Default placeholder image for blog posts'
                        },
                        file: {
                            'en-US': {
                                contentType: 'image/jpeg',
                                fileName: 'blog-placeholder.jpg',
                                // Using a public URL for a placeholder image
                                upload: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
                            }
                        }
                    }
                });

                await placeholderAsset.processForAllLocales();
                await placeholderAsset.publish();
                console.log('Placeholder image created and published.');
            } else {
                console.log('Using existing placeholder image.');
            }
        } catch (error) {
            console.error('Error setting up placeholder image:', error);
            if (error.response) {
                console.error('Error details:', JSON.stringify(error.response.data, null, 2));
            }
            // Continue without the image
            placeholderAsset = null;
        }

        // Add each blog post
        for (const post of blogPosts) {
            console.log(`Creating blog post: ${post.title}...`);

            // Create a richText content field that includes a link to the external post
            const richTextContent = {
                nodeType: 'document',
                data: {},
                content: [
                    {
                        nodeType: 'paragraph',
                        data: {},
                        content: [
                            {
                                nodeType: 'text',
                                value: post.excerpt,
                                marks: [],
                                data: {}
                            }
                        ]
                    },
                    {
                        nodeType: 'paragraph',
                        data: {},
                        content: [
                            {
                                nodeType: 'text',
                                value: 'Read the full article on dev.to: ',
                                marks: [],
                                data: {}
                            },
                            {
                                nodeType: 'hyperlink',
                                data: {
                                    uri: post.externalUrl
                                },
                                content: [
                                    {
                                        nodeType: 'text',
                                        value: post.title,
                                        marks: [
                                            {
                                                type: 'bold'
                                            }
                                        ],
                                        data: {}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            // Create blog post entry
            const blogPostEntry = await environment.createEntry('blogPost', {
                fields: {
                    title: {
                        'en-US': post.title
                    },
                    slug: {
                        'en-US': post.slug
                    },
                    featuredImage: placeholderAsset ? {
                        'en-US': {
                            sys: {
                                type: 'Link',
                                linkType: 'Asset',
                                id: placeholderAsset.sys.id
                            }
                        }
                    } : undefined,
                    excerpt: {
                        'en-US': post.excerpt
                    },
                    content: {
                        'en-US': richTextContent
                    },
                    publishDate: {
                        'en-US': post.publishDate
                    },
                    tags: {
                        'en-US': post.tags
                    },
                    externalUrl: {
                        'en-US': post.externalUrl
                    }
                }
            });

            // Publish the entry
            await blogPostEntry.publish();
            console.log(`✅ Blog post published: ${post.title}`);
        }

        console.log('✅ All blog posts added successfully!');
    } catch (error) {
        console.error('Error adding blog posts:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the script
addBlogPosts(); 