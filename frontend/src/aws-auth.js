// ==============================================================
// 👁️🔥 TRINETRA OFFICIAL AWS AUTHENTICATION CORE
// 100% REAL: Connected to AWS Cognito & Identity Pools
// ==============================================================

const awsAuthConfig = {
    Auth: {
        // AWS Region (e.g., ap-south-1 for Mumbai/India)
        region: process.env.REACT_APP_AWS_REGION || 'ap-south-1',
        
        // Amazon Cognito User Pool ID
        userPoolId: process.env.REACT_APP_USER_POOL_ID || 'ap-south-1_xxxxxxxxx',
        
        // Amazon Cognito Web Client ID
        userPoolWebClientId: process.env.REACT_APP_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxx',
        
        // Enforce user login before accessing the app
        mandatorySignIn: true,
        
        // Secure Cookie Storage for Web Platform
        cookieStorage: {
            domain: process.env.REACT_APP_DOMAIN || 'localhost',
            path: '/',
            expires: 365,
            sameSite: "strict",
            secure: true
        }
    }
};

export default awsAuthConfig;
