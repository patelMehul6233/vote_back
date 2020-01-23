const jwt = require('jsonwebtoken');
const User = require('../modules/user/model');
const PollData = require('../modules/admin/model');
const app = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
module.exports = {
    isAutenticated : (req, res, next) => {
    if (req.headers.authorization !== undefined) {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'top_secret', function (err, decoded) {
            if (err) {
                res.status(500).json({ error: "Not Authorized" });
                return false;
            }
            // let minutes = Math.floor(decoded.exp / 60000);
            // let seconds = ((decoded.exp % 60000) / 1000).toFixed(0);
            // console.log(minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
            // console.log(minutes + ":" + seconds);
            next();
        });
    } else {
        res.status(500).json({ error: "Not Authorized" });
        return false;
    }
}
}
