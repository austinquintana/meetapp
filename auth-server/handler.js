'use strict';

const { google } = require("googleapis");
// const { concatenateToResponse } = require("workbox-streams");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = [
  "https://austinquintana.github.io/meetapp/"
];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

module.exports.getAuthURL = async () => {
  /**
   *
   * Scopes array is passed to the `scope` option. 
   *
   */
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      authUrl,
    }),
  };
};

module.exports.getAccessToken = (event) => {
  // Decode authorization code extracted from the URL query
  const code = decodeURIComponent(`${event.queryStringParameters.code}`);  

  return new Promise((resolve, reject) => {
    /**
     *  Exchange authorization code for access token with a “callback” after the exchange,
     *  The callback in this case is an arrow function with the results as parameters: “error” and “response”
     */

    oAuth2Client.getToken(code, (error, response) => {
      if (error) {
        // console.log("oauth error: " , error);
        return reject(error);
      }
      return resolve(response);
    });
  })
    .then((results) => {
      // Respond with OAuth token 
      console.log(results);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(results),
      };
    })
    .catch((error) => {
      // Handle error
      // console.log("error: " , error);
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    });
};