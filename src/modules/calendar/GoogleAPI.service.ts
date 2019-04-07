import fs = require('fs');
import { google } from 'googleapis';
import readline = require('readline');

export class GoogleAPI {
  // If modifying these scopes, delete token.json.
  static SCOPES = ['https://www.googleapis.com/auth/calendar'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  static TOKEN_PATH = __dirname + '/token.json';

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  static async authorizeAndExec(callback) {
    const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URIS0);
    return new Promise((resolve, reject) => {
      // Check if we have previously stored a token.
      fs.readFile(this.TOKEN_PATH, (err, token) => {
        if (err) return this.getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        resolve(callback(oAuth2Client));
      });
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  static getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    // tslint:disable:no-console
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve, reject) => {
      rl.question('Enter the code from that page here: ', code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) reject(err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), error => {
            if (error) return console.error(error);
            console.log('Token stored to', this.TOKEN_PATH);
          });
          resolve(callback(oAuth2Client));
        });
      });
    });
  }
}
