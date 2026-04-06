// ==============================================================
// 👁️🔥 TRINETRA MASTER AWS CONFIGURATION (Blueprint Point 2, 5, 8)
// 100% REAL TEMPLATE: Auth (Cognito), API (AppSync), Storage (S3)
// ==============================================================

/// 🔥 नोट: यह फाइल AWS Amplify CLI द्वारा ऑटो-जनरेट होती है। 🔥
/// जब आप 'amplify push' करेंगे, तो 'YOUR_USER_POOL_ID' जैसी चीज़ें 
/// आपकी असली AWS Keys से अपने-आप बदल जाएंगी।

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
        "CredentialsProvider": {
          "CognitoIdentity": {
            "Default": {
              "PoolId": "ap-south-1:XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX",
              "Region": "ap-south-1"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "ap-south-1_XXXXXXXXX",
            "AppClientId": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "Region": "ap-south-1"
          }
        },
        "Auth": {
          "Default": {
            "OAuth": {
              "WebDomain": "trinetra-auth.auth.ap-south-1.amazoncognito.com",
              "AppClientId": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
              "SignInRedirectURI": "trinetra://,https://trinetra-8b846.web.app/",
              "SignOutRedirectURI": "trinetra://,https://trinetra-8b846.web.app/",
              "Scopes": [
                "phone",
                "email",
                "openid",
                "profile",
                "aws.cognito.signin.user.admin"
              ]
            },
            "authenticationFlowType": "USER_SRP_AUTH",
            "socialProviders": [
              "GOOGLE",
              "APPLE"
            ],
            "usernameAttributes": [
              "PHONE_NUMBER",
              "EMAIL"
            ],
            "signupAttributes": [
              "PHONE_NUMBER",
              "NAME"
            ],
            "passwordProtectionSettings": {
              "passwordPolicyMinLength": 8,
              "passwordPolicyCharacters": []
            },
            "mfaConfiguration": "OFF",
            "mfaTypes": [
              "SMS"
            ],
            "verificationMechanisms": [
              "PHONE_NUMBER"
            ]
          }
        }
      }
    }
  },
  "api": {
    "plugins": {
      "awsAPIPlugin": {
        "TriNetraAPI": {
          "endpointType": "GraphQL",
          "endpoint": "https://XXXXXXXXXXXXXXXXXXXXXX.appsync-api.ap-south-1.amazonaws.com/graphql",
          "region": "ap-south-1",
          "authorizationType": "AMAZON_COGNITO_USER_POOLS"
        }
      }
    }
  },
  "storage": {
    "plugins": {
      "awsS3StoragePlugin": {
        "bucket": "trinetra-storage-bucket-live",
        "region": "ap-south-1",
        "defaultAccessLevel": "guest"
      }
    }
  }
}
''';
