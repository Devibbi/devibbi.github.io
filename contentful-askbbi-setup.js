// Script to create and publish the 'askBbiLog' content type in Contentful using the Management API
// Usage: node contentful-askbbi-setup.js

const contentfulManagement = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV_ID = 'master'; // Change if your environment is not 'master'

async function run() {
  if (!SPACE_ID || !TOKEN) {
    console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN in .env.local');
    process.exit(1);
  }
  const client = contentfulManagement.createClient({ accessToken: TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENV_ID);

  // Check if content type exists
  let ct;
  try {
    ct = await env.getContentType('askBbiLog');
    console.log('Content type askBbiLog already exists.');
  } catch {
    // Create new content type
    ct = await env.createContentTypeWithId('askBbiLog', {
      name: 'AskBbi Log',
      displayField: 'question',
      fields: [
        { id: 'question', name: 'Question', type: 'Text', required: true },
        { id: 'answer', name: 'Answer', type: 'Text', required: true },
        { id: 'model', name: 'Model', type: 'Symbol', required: false },
        { id: 'userId', name: 'User ID', type: 'Symbol', required: false },
        { id: 'timestamp', name: 'Timestamp', type: 'Date', required: true },
      ]
    });
    console.log('Created content type askBbiLog.');
  }
  // Publish content type if not published
  if (!ct.sys.publishedVersion) {
    await ct.publish();
    console.log('Published content type askBbiLog.');
  } else {
    console.log('Content type askBbiLog is already published.');
  }
}

run().catch(e => {
  console.error('Error setting up askBbiLog content type:', e.message);
  process.exit(1);
});
