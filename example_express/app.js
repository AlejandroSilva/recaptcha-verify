'use strict';
var path = require('path');
var morgan = require('morgan');
var express = require('express');
var app = express();
var swig = require('swig');
//var Recaptcha = require('recaptcha');
var Recaptcha = require('../index');
var recaptcha = new Recaptcha({
    secret: '6LcH7v4SAAAAAPA4ha10THoLd8Yh8H11-PJwCdwp',
    verbose: true
});

app.use( morgan('dev') );

// swig as render engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res){
    res.status(200).render('index');
});
app.get('/check', function(req, res){
    // get the user response (from reCAPTCHA)
    var userResponse = req.query['g-recaptcha-response'];

    recaptcha.checkResponse(userResponse, function(err, response){
        if(err){
            // an internal error?
            res.status(400).render('400', {
                message: err.toString()
            });
            return;
        }

        if(response.success){
            // save session.. create user.. save form data.. render page, return json.. etc.
        }else{
            // show warning, render page, return a json, etc.
        }
        res.status(200).render('check', {
            response: response,
            name: req.query['name'],
            color: req.query['color']
        });
    });
});

// 404
app.use(function(req, res){
    res.status(404).render('404');
});

app.listen(8080, 'localhost', function(){
    console.log('Server waiting for request...');
});