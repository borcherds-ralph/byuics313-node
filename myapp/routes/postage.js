var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    res.render('postage', {
        title: 'Postage'
    });
});

module.exports = router;