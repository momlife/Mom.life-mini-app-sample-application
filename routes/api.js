const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const request = require('request');

const {
    /** @type {Array} */
    ADMIN_USERS,
    SECRET_KEY,
    MOMLIFE_API_HOST,
    APP_ID
} = require('../config/config');

let isDev = process.env.NODE_ENV === 'development';

router.post('/authBind', function(req, res, next) {
    let payload = Object.keys(req.body).sort().map((key) => {
        return `${key}=${req.body[key]}`;
    });

    payload.push(SECRET_KEY);

    let token = jwt.sign(payload.join("&"), SECRET_KEY);

    res.json({
        "status": 200,
        "result": true,
        "auth-token": "JWT " + token
    });
});

router.use(function(req, res, next) {
    if (ADMIN_USERS.includes(req.query['user_id']) || isDev) {
        next();
    } else {
        res.status(403).send(`Forbidden ${req.originalUrl}`);
    }
});

router.get('/getAdditionalButtons', function(req, res, next) {
    res.render('api-additional-buttons', {
        host: req.headers.host,
        layout: false
    });
});



router.get('/getUser', function(req, res, next) {
    request(`${MOMLIFE_API_HOST}/extension/internal/${APP_ID}/user?user_id=${req.query['user_id']}`, function(error, response, body) {
        res.json(JSON.parse(body));
    });
});

module.exports = router;
