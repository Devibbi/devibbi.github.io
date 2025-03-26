require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');
const https = require('https');
const fs = require('fs');
const path = require('path');

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
                tags: ['CSS', 'SASS', 'Web Development', 'Frontend'],
                imageUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--SVZL-V4n--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yaz2kgsnxc6wnn2bfp08.png'
            },
            {
                title: 'How I created Inspirational Homepage Using React/Redux JS',
                slug: 'inspirational-homepage-react-redux',
                excerpt: 'A detailed walkthrough of creating an inspirational homepage using React and Redux.',
                externalUrl: 'https://dev.to/devibbi/how-i-created-inspirational-homepage-using-reactredux-js-g89',
                publishDate: '2024-10-07',
                tags: ['React', 'Redux', 'JavaScript', 'Web Development'],
                imageUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--lDYMz-w2--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3ux40izlf9m55zpahdxe.png'
            },
            {
                title: 'How I created Weather App using React JS',
                slug: 'weather-app-react-js',
                excerpt: 'A step-by-step guide to creating a weather application using React JS.',
                externalUrl: 'https://dev.to/devibbi/how-i-created-weather-app-using-react-js-3m3c',
                publishDate: '2024-09-30',
                tags: ['React', 'JavaScript', 'API', 'Weather App'],
                imageUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--4BjMqsdZ--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k41xdrn7u7n2wdzla0ca.png'
            },
            {
                title: 'How I created A Spotify Clone App using React JS',
                slug: 'spotify-clone-react-js',
                excerpt: 'An in-depth look at building a Spotify clone application with React JS.',
                externalUrl: 'https://dev.to/devibbi/how-i-created-a-spotify-clone-app-using-react-js-40ga',
                publishDate: '2024-09-23',
                tags: ['React', 'JavaScript', 'Spotify', 'Clone App'],
                imageUrl: 'https://res.cloudinary.com/practicaldev/image/fetch/s--KVbhp4GX--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p9z1pizc3k8g9uzwdqqn.png'
            }
        ];

        // Create each blog post with its own image
        for (const post of blogPosts) {
            console.log(`Processing blog post: ${post.title}...`);

            try {
                // Create image asset for this specific post
                console.log(`Creating image asset for: ${post.title}...`);

                // Generate a unique asset ID based on the slug
                const assetId = `blog-image-${post.slug.replace(/[^a-zA-Z0-9]/g, '-')}`;

                // Check if image already exists
                let asset;
                try {
                    asset = await environment.getAsset(assetId);
                    console.log(`Image asset already exists for ${post.title}, skipping creation.`);
                } catch (error) {
                    // Asset doesn't exist, create it
                    console.log(`Creating new image asset for ${post.title}...`);

                    // Create the asset
                    asset = await environment.createAsset({
                        sys: {
                            id: assetId
                        },
                        fields: {
                            title: {
                                'en-US': `${post.title} - Featured Image`
                            },
                            description: {
                                'en-US': `Featured image for blog post: ${post.title}`
                            },
                            file: {
                                'en-US': {
                                    contentType: 'image/jpeg',
                                    fileName: `${post.slug}.jpg`,
                                    upload: post.imageUrl
                                }
                            }
                        }
                    });

                    try {
                        // Process and publish the asset
                        await asset.processForAllLocales();
                        await asset.publish();
                        console.log(`Asset processed and published for ${post.title}.`);
                    } catch (processError) {
                        console.error(`Error processing asset for ${post.title}:`, processError);
                        // Continue without image if processing fails
                        asset = null;
                    }
                }

                // Check if blog post already exists
                let existingEntry;
                try {
                    const entries = await environment.getEntries({
                        content_type: 'blogPost',
                        'fields.slug[match]': post.slug
                    });

                    if (entries.items.length > 0) {
                        existingEntry = entries.items[0];
                        console.log(`Blog post "${post.title}" already exists, updating...`);
                    }
                } catch (error) {
                    console.log(`No existing blog post found for "${post.title}"`);
                }

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

                // Create the entry fields
                const entryFields = {
                    title: {
                        'en-US': post.title
                    },
                    slug: {
                        'en-US': post.slug
                    },
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
                };

                // Only add the featuredImage if we have a valid asset
                if (asset) {
                    entryFields.featuredImage = {
                        'en-US': {
                            sys: {
                                type: 'Link',
                                linkType: 'Asset',
                                id: asset.sys.id
                            }
                        }
                    };
                } else {
                    // Try to find a default image to use
                    try {
                        const assets = await environment.getAssets();
                        const defaultImage = assets.items.find(a =>
                            a.fields && a.fields.title &&
                            a.fields.title['en-US'] &&
                            a.fields.title['en-US'].includes('Placeholder')
                        );

                        if (defaultImage) {
                            entryFields.featuredImage = {
                                'en-US': {
                                    sys: {
                                        type: 'Link',
                                        linkType: 'Asset',
                                        id: defaultImage.sys.id
                                    }
                                }
                            };
                        } else {
                            console.warn(`No image found for ${post.title} and no default image available.`);
                            continue; // Skip this post since featuredImage is required
                        }
                    } catch (imageError) {
                        console.error('Error finding default image:', imageError);
                        continue; // Skip this post since featuredImage is required
                    }
                }

                // Update or create the blog post entry
                let blogPostEntry;
                if (existingEntry) {
                    // Update existing entry
                    existingEntry.fields = entryFields;
                    blogPostEntry = await existingEntry.update();
                } else {
                    // Create new entry
                    blogPostEntry = await environment.createEntry('blogPost', {
                        fields: entryFields
                    });
                }

                // Publish the entry
                try {
                    await blogPostEntry.publish();
                    console.log(`✅ Blog post published: ${post.title}`);
                } catch (publishError) {
                    console.error(`Error publishing blog post ${post.title}:`, publishError);
                    if (publishError.response) {
                        console.error('Publishing error details:', JSON.stringify(publishError.response.data, null, 2));
                    }
                }
            } catch (postError) {
                console.error(`Error processing post "${post.title}":`, postError);
                if (postError.response) {
                    console.error('Error details:', JSON.stringify(postError.response.data, null, 2));
                }
                // Continue with the next post
                continue;
            }
        }

        console.log('✅ Blog post creation process completed!');
    } catch (error) {
        console.error('Error during blog post creation:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the script
addBlogPosts(); 