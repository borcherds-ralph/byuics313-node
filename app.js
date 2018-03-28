const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const util = require('util');
const url = require('url');
const { Client } = require('pg');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./modules/user');
var googleAnalytics = require('./modules/jwt.js');

var app = express();

// Read the DATABASE_URL environment variable and then parse it out. into the various parts.
var db_url = url.parse(process.env.DATABASE_URL);

var scheme = db_url.protocol.substr(0, db_url.protocol.length - 1);
var user = db_url.auth.substr(0, db_url.auth.indexOf(':'));
var pass = db_url.auth.substr(db_url.auth.indexOf(':') + 1, db_url.auth.length);
var host = db_url.host.substr(0, db_url.host.indexOf(':'));
var pgport = db_url.host.substr(db_url.host.indexOf(':') + 1, db_url.host.length);
var db = db_url.path.substr(db_url.path.indexOf('/') + 1, db_url.path.length);

// Connect to the PostgreSQL server
const client = new Client({
    host: host,
    user: user,
    database: db,
    password: pass
});

client.connect();

// Set static Path
app.use(express.static(path.join(__dirname, 'public')));

// set our application port
app.set('nodeport', process.env.PORT || 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('routes', path.join(__dirname, 'routes'));

// Body Parser Middle Ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'imdkaf8dck)6e#ylzr3vsvi^_6xlmig@d@7pmy5tn@coqt(l&k',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// route for Home-Page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        message: 'Please log into the dashboard to see your info.',
        pgname: 'login'
    })
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup', {
            title: 'Sign-up Page',
            pgname: 'signup'
        });
    })
    .post((req, res) => {
        User.create({
                username: req.body.username,
                email: req.body.email,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode,
                password: req.body.password

            })
            .then(user => {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            })
            .catch(error => {
                res.redirect('/signup');
            });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {

        res.render('login', { title: 'Login Page', pgname: 'login' });
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function(user) {
            if (!user) {

                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            }
        });
    });

// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard', {
            title: 'Personal Tracking Dashboard',
            zipcode: req.session.user.zipcode,
            city: req.session.user.city,
            state: req.session.user.state,
            pgname: 'dashboard'
        });
        console.log(req.session);
    } else {
        res.redirect('/login');
    }
});


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// Check AJAX calls for user registration
// Check to see if a username is taken or not
app.get('/validateUsername', (req, res) => {
    User.findOne({ where: { username: req.query.uname } }).then(function(user) {
        if (!user) {
            res.json(false);
        } else {
            res.json(true);
        }
    });

});

app.get('/validateEmail', (req, res) => {
    User.findOne({ where: { email: req.query.email } }).then(function(user) {
        if (!user) {
            res.json(false);
        } else {
            res.json(true);
        }
    });

});

// route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!")
});


// start the express server
//app.listen(app.get('nodeport'), () => console.log(`App started on port ${app.get('nodeport')}`));

module.exports = app;