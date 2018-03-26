var { google } = require('googleapis');
var analyticsVar = google.analytics('v3');

var key = require('../google_key.json');
var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key, ['https://www.googleapis.com/auth/analytics.readonly'], // an array of auth scopes
    null
);

jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }

    // Make an authorized request to analytics.
    analyticsVar.data.ga.get({
        auth: jwtClient,
        'ids': key.client_id,
        'metrics': 'ga:pageviews,ga:sessions'
    }, function(err, resp) {
        // handle err and response
    });
});