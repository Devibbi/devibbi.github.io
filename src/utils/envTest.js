export function testEnvVariables() {
    console.log('Environment Variables Test:');
    console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID);
    console.log('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    return {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    };
} 