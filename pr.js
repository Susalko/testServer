
var request = require('request');

const client_id = 'srars2HTRv22zXz6E6_1OQ';
const client_secret = 'TAiFi6hGfp4u4cf6KqjNzecB2h49Qc5o';
const redirect_uri = 'http://localhost:3000';

module.exports = function (req, res) {
console.log(req.query.code + 'я тут');
    //this will check if the code parameter is in the url, if not the most liekly case is that this is the user's inital visit to oauth and we need to redirect them (step 1)
    //if there is a code, it most likely means they were redirected here from zoom oauth screen
    if (req.query.code) {

        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + redirect_uri + '/about';

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

                request.get('https://zoom.us/api/profile', function (error, response, body) {
                    //do something with the data
                    //this is most likely where you want to connect the zoom user to the calendly user, there will be a zoom user id
                    //add where you'll want to store the access token for future requests

                }).auth(null, null, true, body.access_token);
            
            } else {
                //handle error, something went wrong
            }

        }).auth(client_id, client_secret);

        return;
    }

    //STEP 2
    //no code provide, so redirect the user to get code
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri);
};