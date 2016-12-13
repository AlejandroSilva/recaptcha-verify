# recaptcha-verify

Implements Google's [reCAPTCHA](https://developers.google.com/recaptcha/) in node.js. It can be used with pure node.js or in combination with express.js. Doesn't require additional libraries, just core `http` module.

## Installation

- sign up for an [API key](https://www.google.com/recaptcha/admin/create) in the google's page.
- create a [new site](https://www.google.com/recaptcha/admin#list) to get the **site key** and **public**.
- install the package with:

```bash
$ npm install --save recaptcha-verify
```


## Frontend Usage with plain HTML

Use the **site key** to display the widget in the page (inside a form).
For a more info on how to display the widget, see the [documentation](https://developers.google.com/recaptcha/docs/display).

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document title</title>
    <script src='https://www.google.com/recaptcha/api.js'></script>
</head>
<body>
<form action="/nodeform">
    <input type="text"/>
    <input type="text"/>
    <div class="g-recaptcha" data-sitekey="SITE_KEY"></div>
    <input type="submit">
</form>
</body>
</html>
```

## Backend Usage with express.js

In node we must use the **secret** key.

### Recaptcha([options])

Options object have 2 keys:

- *secret*: the **secret key** of the recaptcha.
- *verbose*: if set to **true**, it show relevant information on each validation.Default: false.

### .checkResponse(userResponse, callback)
- *userResponse*: is the key provided in each validation by the reCAPTCHA widget, see more info in the [documentation](https://developers.google.com/recaptcha/docs/verify).
- *callback*: have an *error* and a *response* params.

Callback returns an *error* when something is wrong. 
The *response* object is described in the [documentation](https://developers.google.com/recaptcha/docs/verify).

```javascript
var Recaptcha = require('recaptcha-verify');
var recaptcha = new Recaptcha({
    secret: 'SECRET_KEY',
    verbose: true
});
app.get('/check', function(req, res){
    // get the user response (from reCAPTCHA)
    var userResponse = req.query['g-recaptcha-response'];

    recaptcha.checkResponse(userResponse, function(error, response){
        if(error){
            // an internal error?
            res.status(400).render('400', {
                message: error.toString()
            });
            return;
        }
        if(response.success){
            res.status(200).send('the user is a HUMAN :)');
            // save session.. create user.. save form data.. render page, return json.. etc.
        }else{
            res.status(200).send('the user is a ROBOT :(');
            // show warning, render page, return a json, etc.
        }
    });
});
```

## Contact

For more information, please check out [https://github.com/AlejandroSilva](https://github.com/AlejandroSilva) or send me and email to pm5k.sk[at]gmail.com
