const {google} = require('googleapis');
const TOKEN_PATH = 'token.json';
const fs = require('fs');
const path = require('path');

module.exports = {
  scopes:  ['https://www.googleapis.com/auth/calendar.readonly',,
            'https://www.googleapis.com/auth/calendar.events.readonly',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar.readonly'
  ],
  credentials: function(){
    const filePath = path.join(__dirname, 'credentials.json');
    credsText = fs.readFileSync(filePath);
    return JSON.parse(credsText);
  },
  init: function(){
    const {client_secret, client_id, redirect_uris} = this.credentials().installed;
    this.oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  },
  get: function(){
    return this.oAuth2Client;
  },
  hasToken: function(){
    return fs.existsSync(TOKEN_PATH);
  },
  loginWithToken: function(){
    token = fs.readFileSync(TOKEN_PATH);
    this.oAuth2Client.setCredentials(JSON.parse(token));
    return Promise.resolve();
  },
  generateLoginAuthUrl: function(){
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
  },
  loginWithCode: function(code){
    return new Promise((resolve, reject) => {
      this.oAuth2Client.getToken(code, (err, token) => {
        if (err) reject('Error retrieving access token');
        this.oAuth2Client.setCredentials(token);
        resolve();
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        });
      });
    });
  }
};
