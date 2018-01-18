export const COGNITO_CONFIG = {
    ClientId : '4j1ev7oqrtbdsl97b478luci2', // Your client id here
    AppWebDomain : 'tide.auth.us-east-1.amazoncognito.com',
    TokenScopesArray : ['profile','email','openid'],
    RedirectUriSignIn : 'http://localhost:4200',
    RedirectUriSignOut : 'http://localhost:4200',
    IdentityProvider : 'Google', 
    UserPoolId : 'us-east-1_UDZwdQ2Lw', 
    AdvancedSecurityDataCollectionFlag : false
}

