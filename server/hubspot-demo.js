var express = require('express'),
    app = express(),
    request = require('request'),
    bodyparser = require('body-parser');

app.use(bodyparser.json());

var client_id = "a0f3bb5b-b698-4634-8445-1d16f4e51360",
    client_secret = "6164a3b5-7316-4569-8b19-15b4b0f10758",
    scope = "content",
    /* scope = "contacts%20content%20reports%20social%20automation%20timeline%20forms%20files%20hubdb&transactional-email", */
    redirect_uri = "https://localhost:8889/callback";

app.get("/oauth", function (req, res) {
    res.redirect("https://app.hubspot.com/oauth/authorize?client_id=" + client_id + "&scope=" + scope + "&redirect_uri=" + redirect_uri);
});

app.get("/callback", function (req, res) {
    var code = req.query.code;
    if (code) {
        request({
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            url: "https://api.hubapi.com/oauth/v1/token?client_id=" + client_id,
            form: {
                grant_type: "authorization_code",
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirect_uri,
                code: code
            }
        }, function (error, response, body) {
            var obj = JSON.parse(body),
                accessToken = obj.access_token;

            request({
                method: "GET",
                headers: {
                    /* Authorization: "Bearer " + accessToken, */
                    "content-type": "application/x-www-form-urlencoded"
                },
                url: "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=5&hapikey=6890ba00-a2bd-4abb-b708-5a42398ed6cf" 
            }, function (err, res, bod) {
                var result = JSON.parse(bod);
                debugger;
            });

        });
    }
});

app.listen(8888, function () {
    console.log("Server is listening on port: ", 8888);
})

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//Using passport-hubspot-oauth2.0

var passport = require('passport'),
    /* HubSpot = require('passport-hubspot').Strategy, */
    HubSpot = require('passport-hubspot-oauth2.0').Strategy;

passport.use(new HubSpot({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "https://localhost:8889/login/callback",
    scope: ['content']
}, function (req, accessToken, refreshToken, profile, done) {
    //Unreachable
    debugger;
    done(null, profile);
}));

app.get("/login", passport.authenticate('hubspot'));

app.get("/login/callback", function (req, res) {
    var code = req.query.code;

    debugger;

    if (code) {
        request.post("https://api.hubapi.com/oauth/v1/token?grant_type=authorization_code&client_id=" + client_id + "&client_secret=" + client_secret + "&redirect_uri=https://localhost:8889/login/callback&code=" + code, {
            /* grant_type: "authorization_code",
            client_secret: client_secret,
            redirect_uri: "https://localhost:8889/login/callback",
            code: code */
        }, function (error, response, body) {
            debugger;
        });
    }
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//HTTPS/SSL configuration
var https = require('https');

var selfSigned = require('openssl-self-signed-certificate'); //for local development 

var options = {
    key: selfSigned.key,
    cert: selfSigned.cert
};

var port = 8889;

https.createServer(options, app)
    .listen(port, function () {
        console.log(`HTTPS started on port ${port + 0}.`);

    });