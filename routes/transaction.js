'use strict';

const express = require('express');
const router = express.Router();

router.all('/complete', function(req, res, next) {
    res.json({
        "status": 201
    });
});

module.exports = router;