import * as contentfulManagement from 'contentful-management';

const managementClient = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

/**
 * Save a Q&A interaction to Contentful (content type: askBbiLog)
 * @param {Object} param0
 * @param {string} param0.question
 * @param {string} param0.answer
 * @param {string} [param0.model] - Which LLM answered
 * @param {string} [param0.userId] - If you want to log user/session
 */
export async function saveAskBbiLog({ question, answer, model = '', userId = '' }) {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const env = await space.getEnvironment('master'); // Or your env name
    const entry = await env.createEntry('askBbiLog', {
      fields: {
        question: { 'en-US': question },
        answer: { 'en-US': answer },
        model: { 'en-US': model },
        userId: { 'en-US': userId },
        timestamp: { 'en-US': new Date().toISOString() }
      }
    });
    return entry;
  } catch (e) {
    console.error('Failed to log AskBbi Q&A to Contentful:', e.message);
    return null;
  }
}
