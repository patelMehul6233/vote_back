const jwt = require('jsonwebtoken');
const User = require('../model');
const PollData = require('../../admin/model');
const app = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const createRegister = async (req, res, next) => {
    console.log(req.body)
    const token = jwt.sign({ data: req.body}, 'save_auth', { expiresIn: 86400000 });
    const regiterUsers = new User.User({
        name: req.body.name,
        GovermentId: req.body.GovermentId,
        birthDate: req.body.birthDate,
    });
    const alreadyUser = await User.User.find({});
    const checkUsername = alreadyUser.some((v, k, arr) => v.name === req.body.name);
    const checkIdAndNumber = alreadyUser.some((v, k, arr) => v.GovermentId.idType === req.body.GovermentId.idType
        && v.GovermentId.number === req.body.GovermentId.number);
        // if (checkUsername) {
        //     return res.status(500).send({
        //         status: 'false',
        //         errs: 'username already exists'
        //     });
        // }
        if (checkIdAndNumber) {
            return res.status(500).send({
                status: 'false',
                errs: `Goverment proof or it's number already taken`
            });
        } else {
            regiterUsers.save((err, data) => {
                if (err) {
                    console.log(err)
                }
               return res.status(200).send({
                    status: true,
                    token: token,
                    data: data
                });
            })
        }
    
}

const getRegister = (req, res, next) => {
    User.User.find({}).exec((err, userData) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({
            userData: userData
        });
    })
}

const isAutenticated = (req, res, next) => {
    // const cookieExp = req.session.cookie._expires;
    // const today = new Date();
    // console.log(cookieExp.getMilliseconds(), today.getMilliseconds())
    if (req.headers.authorization !== undefined) {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'save_auth', function (err, decoded) {
            if (err) {
                res.status(500).json({ error: "Not Authorized" });
                return false;
            }
           // console.log('expiry Date', decoded);
            let minutes = Math.floor(decoded.exp / 60000);
            let seconds = ((decoded.exp % 60000) / 1000).toFixed(0);
            // console.log(minutes + ":" + (seconds < 10 ? '0' : '') + seconds);
            // console.log(minutes + ":" + seconds);
            return next();
        });
    } else {
        res.status(500).json({ error: "Not Authorized" });
        return false;
    }
}
const userchecked = (req, res, next) => {

    res.status(200).send({ authentication: "true" });
}

const selectedPoll = (req, res, next) => {
    console.log(req.body)
}

const givenToVote = (req, res, next) => {
    PollData.PollData.find({}).exec((err, pollData) => {
        const mehul = pollData;
        pollData = pollData.find((v, k, arr) => {
            return v.pollNum === req.body.nums;
        })
        const searchIndex = pollData.candidateDetail.findIndex((v, k, arr) => {
            return v._id == req.body._id
        })
        pollData.candidateDetail[searchIndex].numOFVote = req.body.numOFVote;
        PollData.PollData.findByIdAndUpdate({ _id: req.body.mainId }, { $set: { candidateDetail: pollData.candidateDetail } }, { new: true }, function (err, updatedZone) {
            res.status(200).send({
                updateData: updatedZone,
                newUp: mehul,
                status: 'true'
            });
        });
    })
}

const logoutUser = (req, res, next) => {
    if (req.headers.authorization !== undefined) {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'save_auth', function (err, decoded) {
            if (err) {
                res.status(500).json({ error: "Not Authorized" });
                return false;
            }
            decoded.exp = 0;
            decoded.iat = 0;
            const token = jwt.sign({ data: decoded.data }, 'save_auth', { expiresIn: 0 });
            res.status(200).json({ msg: "Successfully Logout",token:token });

        });
    } else {
        res.status(500).json({ error: "Not Authorized" });
        return false;
    }
}

module.exports = {
    createRegister,
    getRegister,
    isAutenticated,
    userchecked,
    selectedPoll,
    givenToVote,
    logoutUser
}