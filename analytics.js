"use strict"
//Service account fra google. med sertifikat og tokens

var google = require('googleapis');
var analytics = google.analyticsreporting("v4");
var key = require('./google_key.json');

exports.fetch = (request) => {
    return new Promise((resolve, reject) => {
        var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ["https://www.googleapis.com/auth/analytics.readonly"], null);
        jwtClient.authorize(function(err, tokens) {
            if (err) {
                console.log(err);
                return;
            }
            analytics.reports.batchGet({
                resource: request,
                auth: jwtClient
            }, function(err, resp) {
                //console.log(err, resp);
                if (err) {
                    reject(err);
                }
                resolve(resp);
            });
        });
    })
}