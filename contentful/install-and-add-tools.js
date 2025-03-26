require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if contentful-management is installed
try {
    // Try to require contentful-management
    require.resolve('contentful-management');
    console.log('contentful-management is already installed.');
} catch (e) {
    // If it fails, install it
    console.log('Installing contentful-management...');
    try {
        execSync('npm install contentful-management --save-dev', { stdio: 'inherit' });
        console.log('contentful-management installed successfully.');
    } catch (err) {
        console.error('Failed to install contentful-management:', err);
        process.exit(1);
    }
}

// Now that we're sure contentful-management is installed, we can require it
const contentful = require('contentful-management');

async function addToolsSkills() {
    // Check if we have the necessary environment variables
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

        console.log('Creating tools skills entry...');
        // Create a new entry for tools-related skills
        const entry = await environment.createEntry('skill', {
            fields: {
                category: {
                    'en-US': 'Development Tools'
                },
                skills: {
                    'en-US': [
                        'Git & GitHub',
                        'Redux Toolkit (RTK)',
                        'Cursor Editor',
                        'Docker',
                        'VS Code',
                        'Postman',
                        'Webpack',
                        'Chrome DevTools',
                        'GitHub Actions',
                        'Figma'
                    ]
                },
                icon: {
                    'en-US': '🛠️'
                }
            }
        });

        // Publish the entry
        console.log('Publishing entry...');
        await entry.publish();

        console.log('✅ Tools skills added successfully!');
        console.log('Entry ID:', entry.sys.id);
    } catch (error) {
        console.error('Error adding tools skills:', error);
        // Print more detailed error information
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the script
addToolsSkills(); 