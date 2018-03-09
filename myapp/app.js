var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var math = require('./routes/math');
var urlencodedParser;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.post('/math', function(res, req) {
    var math = {
        firstNum: res.body.number1,
        secondNum: res.body.number2,
        operator: res.body.operator1
    }

    var answer = eval(math.firstNum + math.operator + math.secondNum)
    req.render('math', {
        num1: math.firstNum,
        num2: math.secondNum,
        operator1: math.operator,
        answer: answer
    });
})

app.post('/postage', function(req, res) {

    var typeOfLetter = req.body.mailType;
    var weightOfLetter = req.body.weight;
    var priceTotal = calculateRate(typeOfLetter, weightOfLetter);
    var price;
    if (priceTotal == 'Package too Large') {
        price = 'Package Too Large for this type of mailer'
    } else {
        price = priceTotal;
    }

    res.render('postage', {
        title: 'Postage Calculator',
        typeOfLetter: typeOfLetter,
        weight: weightOfLetter,
        price: price
    })

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


function calculateRate(typeOfLetter, weightOfLetter) {

    if ((typeOfLetter == 'Letters (Stamped)' || typeOfLetter == 'Letters (Metered)') && weightOfLetter > 3.5) {
        typeOfLetter = 'Large Envelopes (Flats)';
    }
    var price;
    switch (typeOfLetter) {
        case 'Letters (Stamped)':
            switch (true) {
                case (weightOfLetter <= 1):
                    price = 0.50;
                    break;

                case (weightOfLetter > 1 && weightOfLetter <= 2):
                    price = 0.71;
                    break;

                case (weightOfLetter > 3 && weightOfLetter <= 3):
                    price = 0.92;
                    break;

                case (weightOfLetter > 3 && weightOfLetter <= 3.5):
                    price = 1.13;
                    break;
            }
            break;

        case 'Letters (Metered)':
            switch (true) {
                case (weightOfLetter <= 1):
                    price = 0.47;
                    break;

                case (weightOfLetter > 1 && weightOfLetter <= 2):
                    price = 0.68;
                    break;

                case (weightOfLetter > 2 && weightOfLetter <= 3):
                    price = 0.89;
                    break;

                case (weightOfLetter > 3 && weightOfLetter <= 3.5):
                    price = 1.10;
                    break;
            }
            break;

        case 'Large Envelopes (Flats)':
            switch (true) {
                case (weightOfLetter <= 1.0):
                    price = 1;
                    break;

                case (weightOfLetter > 1 && weightOfLetter <= 2.0):
                    price = 1.21;
                    break;

                case (weightOfLetter > 2 && weightOfLetter <= 3.0):
                    price = 1.42;
                    break;

                case (weightOfLetter > 3 && weightOfLetter <= 4.0):
                    price = 1.63;
                    break;

                case (weightOfLetter > 4 && weightOfLetter <= 5.0):
                    price = 1.84;
                    break;

                case (weightOfLetter > 5 && weightOfLetter <= 6.0):
                    price = 2.05;
                    break;

                case (weightOfLetter > 6 && weightOfLetter <= 7.0):
                    price = 2.26;
                    break;

                case (weightOfLetter > 7 && weightOfLetter <= 8.0):
                    price = 2.47;
                    break;

                case (weightOfLetter > 8 && weightOfLetter <= 9.0):
                    price = 2.68;
                    break;

                case (weightOfLetter > 9 && weightOfLetter <= 10.0):
                    price = 2.89;
                    break;

                case (weightOfLetter > 10 && weightOfLetter <= 11.0):
                    price = 3.10;
                    break;

                case (weightOfLetter > 11 && weightOfLetter <= 12.0):
                    price = 3.31;
                    break;

                case (weightOfLetter > 12 && weightOfLetter <= 13.0):
                    price = 3.52;
                    break;

                case (weightOfLetter > 13):
                    price = 'Package too Large';
                    break;
            }
            break;

        case ('First-Class Package Service-Retail'):
            switch (true) {
                case (weightOfLetter <= 4):
                    price = 3.5;
                    break;

                case (weightOfLetter > 4 && weightOfLetter <= 8):
                    price = 3.75;
                    break;

                case (weightOfLetter > 8 && weightOfLetter <= 9):
                    price = 4.1;
                    break;

                case (weightOfLetter > 9 && weightOfLetter <= 10):
                    price = 4.45;
                    break;

                case (weightOfLetter > 10 && weightOfLetter <= 11):
                    price = 4.8;
                    break;

                case (weightOfLetter > 11 && weightOfLetter <= 12):
                    price = 5.15;
                    break;

                case (weightOfLetter > 12 && weightOfLetter <= 13):
                    price = 5.5;
                    break;

                case (weightOfLetter > 13):
                    price = 'Package too Large';
                    break;
            }
            break;

        default:
            price: 'unknown package';
            break;
    }

    return price;
}

module.exports = app;