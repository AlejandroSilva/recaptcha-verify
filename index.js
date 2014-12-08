'use strict';
var https = require('https');

var Recaptcha = function Recaptcha(options){
    options = options || {};
    this.verbose = options.verbose || false;

    // check for the secret key in the "constructor"
    if(!options.secret){
        throw new Error('reCAPTCHA: the secret key must be provided.')
    }
    // set the secret key and the base path for the request
    this.secret = options.secret;
    this.path = '/recaptcha/api/siteverify?secret='+this.secret;
    this.logg('reCAPTCHA > base path: '+ this.path);
};

Recaptcha.prototype.checkResponse = function(userResponse, callback){
    var self = this;
    var fullUrl = this.path+'&response='+userResponse;
    this.logg('reCAPTCHA > userResponse: '+userResponse);

    https.get({
        hostname: 'www.google.com',
        path: fullUrl
    }, function(res){
        // check for a 403 status from google
        if(res.statusCode===403){
            // this can happens on a non secure request (http instead of https)
            self.logg("reCAPTCHA > statusCode=403... SSL problems?");
            return callback(new Error('Google says Forbidden (403), SSL problems?'));
        }

        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('error', function(err){
            // "If any error is encountered during the request (be that with DNS resolution, TCP level errors, or actual HTTP parse errors)
            self.logg("reCAPTCHA > http request/response error, check the network.");
            return callback(err);
        });
        res.on('end', function(){
            var body = chunks.join('');
            // return an object, not a string
            try {
                body = JSON.parse(body);
                return callback(null, body);
            }catch(ex){
                self.logg("reCAPTCHA > error parsing: ", body);
                return callback(new Error('Error parsing the response to an object.'));
            }
        });

    }).on('error', callback);  // callback(e)
};

Recaptcha.prototype.logg = function (){
    if(this.verbose)
        console.info.apply(console, arguments);
};

module.exports = Recaptcha;