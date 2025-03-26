require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');

const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function addToolsSkills() {
    try {
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment('master');

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
        await entry.publish();

        console.log('Tools skills added successfully!');
        console.log('Entry ID:', entry.sys.id);
    } catch (error) {
        console.error('Error adding tools skills:', error);
    }
}

addToolsSkills(); 