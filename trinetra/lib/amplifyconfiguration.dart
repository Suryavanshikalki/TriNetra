// फाइल का नाम: lib/amplifyconfiguration.dart

/// 🔥 यहाँ आपकी AWS की असली Keys आएंगी 🔥
/// AWS Amplify CLI से जो JSON कॉन्फ़िगरेशन मिलता है, उसे इन तीन कोट्स (''') के बीच में पेस्ट कर दें।
const String amplifyconfig = '''
{
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "IdentityManager": {
          "Default": {}
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "YOUR_USER_POOL_ID", 
            "AppClientId": "YOUR_APP_CLIENT_ID", 
            "Region": "ap-south-1" 
          }
        },
        "Auth": {
          "Default": {
            "authenticationFlowType": "USER_SRP_AUTH"
          }
        }
      }
    }
  }
}
'''; 
// ऊपर दिए गए "YOUR_USER_POOL_ID" जैसी चीज़ों को अपनी असली Keys से बदल दीजियेगा।
