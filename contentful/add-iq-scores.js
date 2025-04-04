const contentful = require('contentful-management');

/**
 * Adds an IQ quiz score to Contentful
 * This would typically be called from a server-side API route
 * @param {Object} scoreData - The score data to add
 * @returns {Promise<Object>} - The created entry or error message
 */
async function addIQScore(scoreData) {
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN || !process.env.CONTENTFUL_SPACE_ID) {
        console.error('Missing environment variables. Make sure CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID are set.');
        return { success: false, error: 'Missing environment variables' };
    }

    // Create Contentful management client
    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    try {
        // Connect to Contentful
        console.log('Connecting to Contentful...');
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment('master');
        console.log('Connected to Contentful successfully.');

        // Prepare the entry fields with required locale (en-US)
        const fields = {
            playerName: { 'en-US': scoreData.playerName },
            score: { 'en-US': scoreData.score },
            level: { 'en-US': scoreData.level },
            date: { 'en-US': scoreData.date || new Date().toISOString() },
        };

        // Add optional fields if they exist
        if (scoreData.streak !== undefined) {
            fields.streak = { 'en-US': scoreData.streak };
        }
        if (scoreData.questionsCorrect !== undefined) {
            fields.questionsCorrect = { 'en-US': scoreData.questionsCorrect };
        }
        if (scoreData.totalQuestions !== undefined) {
            fields.totalQuestions = { 'en-US': scoreData.totalQuestions };
        }
        if (scoreData.playerIp) {
            fields.playerIp = { 'en-US': scoreData.playerIp };
        }

        // Create the entry
        console.log(`Creating IQ quiz score entry for player: ${scoreData.playerName}...`);
        const entry = await environment.createEntry('iqQuizScore', { fields });

        // Publish the entry
        await entry.publish();
        console.log(`✅ IQ quiz score published: ${scoreData.playerName} scored ${scoreData.score} pts (${scoreData.level})`);

        return { success: true, entry };
    } catch (error) {
        console.error('Error adding IQ quiz score:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
        return { success: false, error: error.message };
    }
}

// For command-line testing
if (require.main === module) {
    // Sample test data
    const testScore = {
        playerName: "Test Player",
        score: 25,
        level: "Superior",
        streak: 3,
        questionsCorrect: 4,
        totalQuestions: 5,
        date: new Date().toISOString(),
        playerIp: "127.0.0.1"
    };

    // Run the function
    addIQScore(testScore)
        .then(result => {
            if (result.success) {
                console.log('Score added successfully!');
            } else {
                console.error('Failed to add score:', result.error);
            }
        })
        .catch(err => {
            console.error('Unexpected error:', err);
        });
}

module.exports = { addIQScore }; 