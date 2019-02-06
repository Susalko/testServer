var request = require('request');
const express = require('express');
const test = require('./pr');
const app = express()
var http = require("https");

// app.get('/', (request, response) => {
// })
const client_id = 'srars2HTRv22zXz6E6_1OQ';
const client_secret = 'TAiFi6hGfp4u4cf6KqjNzecB2h49Qc5o';
const redirect_uri = 'http://localhost:3000';

app.get('/', function(req, res){
    var data = {
        topic: "top11231231",
        type: 2,
        start_time: "2019-02-07T19:00:00Z",
        duration: "150",
        timezone: "Europe/Moscow",
        password: "",
        agenda: "ItsAll",
        settings: {
          host_video: false,
          cn_meeting: false,
          in_meeting: false,
          join_before_host: false,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 2,
          audio: "both",
          auto_recording: "none",
          enforce_login: false,
          enforce_login_domains: "",
          alternative_hosts: ""
        }
      };
    console.log(req.query.code + 'я тут');
    //this will check if the code parameter is in the url, if not the most liekly case is that this is the user's inital visit to oauth and we need to redirect them (step 1)
    //if there is a code, it most likely means they were redirected here from zoom oauth screen
    if (req.query.code) {

        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + redirect_uri;

        //STEP 3
        //we need to exchange the code for a oauth token
        request.post(url, function (error, response, body) {
            console.log(body + '  = body');
            //the response should be a JSON payload
            body = JSON.parse(body);
            
            //and contain an access token
            if (body.access_token) {

                //STEP 4
                //we can now use the access token to make API calls
                var options = {
                    "method": "POST",
                    "hostname": "api.zoom.us",
                    "port": null,
                    "path": "/v2/users/TvCPTVHtQRe4Oxme-5UZjA/meetings",
                    "headers": {
                      "content-type": "application/json",
                      "authorization": "Bearer " + body.access_token
                    }
                  };
                  
                  var req = http.request(options, function (res) {
                    var chunks = [];
                  
                    res.on("data", function (chunk) {
                      chunks.push(chunk);
                    });
                  
                    res.on("end", function () {
                      var body = Buffer.concat(chunks);
                      console.log(body.toString());
                    });
                  });
                  
                  req.write(JSON.stringify(data));
                  req.end();
            
            } else {
                //handle error, something went wrong
            }

        }).auth(client_id, client_secret);

        return;
    }

    //STEP 2
    //no code provide, so redirect the user to get code
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri + '/about');
});

app.get('/about', function (req, res) {
    res.send('About this wiki');
  })
app.listen(3000)