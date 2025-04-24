// utils/contentfulAskBbi.js
const contentful = require('contentful-management');

/**
 * Saves a log entry to Contentful for AskBbi interactions
 * @param {Object} params - The parameters object
 * @param {string} params.question - The user's question
 * @param {string} params.answer - The AI's answer
 * @param {string} [params.model] - The AI model used (optional)
 * @param {string} [params.userId] - User ID (optional)
 * @param {Object} [params.metadata] - Additional metadata (optional)
 * @returns {Promise<Object>} - The created entry
 */
export async function saveAskBbiLog(params) {
  try {
    const { question, answer, model = 'unknown', userId = 'anonymous', metadata = {} } = params;

    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
      console.warn('Missing Contentful credentials, skipping log save');
      return null;
    }

    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    const entry = await environment.createEntry('askBbiLog', {
      fields: {
        question: { 'en-US': question },
        answer: { 'en-US': answer },
        model: { 'en-US': model },
        userId: { 'en-US': userId },
        timestamp: { 'en-US': new Date().toISOString() }
        // Note: Custom metadata fields are not directly stored as they're not in the content type
        // You could stringify metadata and store it in one of the existing fields if needed
      }
    });

    // Publish the entry immediately
    await entry.publish();

    console.log('Saved AskBbi log:', entry.sys.id);
    return entry;
  } catch (error) {
    console.error('Failed to save AskBbi log:', error);
    return null;
  }
}