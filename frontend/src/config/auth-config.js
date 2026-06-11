// ==========================================
// TRINETRA SUPER APP - AUTH CONFIGURATION
// Path: src/config/auth-config.js
// Status: 100% ASLI AWS (No Dummy)
// ==========================================

const authConfig = {
  Auth: {
    Cognito: {
      // 🛰️ Point 1: AWS Regional Mesh (North Virginia - us-east-1)
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '', 
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
      
      // 🔐 Point 2: 5+1 Strict Login Logic
      loginWith: {
        email: true,
        phone: true, // OTP via AWS SNS (Real SMS Gateway)
        oauth: {
          domain: 'auth.trinetra.com', // Your Verified Domain
          scopes: [
            'phone', 
            'email', 
            'profile', 
            'openid', 
            'aws.cognito.signin.user.admin'
          ],
          redirectSignIn: [
            'https://app.trinetra.com/', 
            'trinetra://' // Mobile Deep Link
          ],
          redirectSignOut: ['https://app.trinetra.com/'],
          responseType: 'code',
          
          // 🛡️ Asli Social Providers (Point 2)
          providers: ['Google', 'Apple', 'Microsoft', 'GitHub'] 
        }
      }
    }
  },
  
  // 📁 Point 4: Media Storage (S3 - Universal Download Support)
  Storage: {
    S3: {
      bucket: 'trinetra-media-storage-v6',
      region: 'us-east-1'
    }
  },

  // 🛡️ Point 12H: Security & Monitoring
  aws_waf_enabled: true,
  aws_cloudwatch_logging: true
};

export default authConfig;
