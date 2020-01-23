const jwt = require('jsonwebtoken');
const Admin = require('../model');
const PollData = require('../model');
const PollResult = require('../model');
const uniqid = require('uniqid');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const loginAdmin = (req, res, next) => {
    const adminUsers = new Admin.Admin({
        name: 'mehul22',
        password: 'Mehul@123'
    });
    adminUsers.save((err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({
            status: true,
            data: data
        });
    })
}
const checkLoginAdmin = async (req, res, next) => {
    // let token = req.headers.authorization.split(" ")[1];
    // //console.log('ttttttttttttttttttttttttttttttttt', token)
    // jwt.verify(token, 'save_auth', function (err, decoded) {
    //     console.log('ssssssssssssss', decoded)
    //  })
    const token = jwt.sign({ data: req.body }, 'top_secret', { expiresIn: 86400000 });
    const alreadyAdmin = await Admin.Admin.find({});
    const checkUsername = alreadyAdmin.some((v, k, arr) => v.name === req.body.name);
    const checkPassword = alreadyAdmin.some((v, k, arr) => v.password === req.body.password);
    
  // console.log(checkUsername, checkPassword);
        if(checkUsername && checkPassword) {
            return res.status(200).send({
                status: true,
                data: alreadyAdmin,
                token: token
            });
        } else {
            return res.status(500).send({
                status: 'false',
                err: 'username and password incorrect'
            });
        }
       
    // })
}
const adminLogout = (req, res, next) => {
    if (req.headers.authorization !== undefined) {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'top_secret', function (err, decoded) {
            if (err) {
                res.status(500).json({ error: "Not Authorized" });
                return false;
            }
            decoded.exp = 0;
            decoded.iat = 0;
            console.log('ddddddddddddddd', decoded)
            const token = jwt.sign({ data: decoded.data }, 'top_secret', { expiresIn: 0 });
            res.status(200).json({ msg: "Successfully Logout",token:token });

        });
    } else {
        res.status(500).json({ error: "Not Authorized" });
        return false;
    }
}
const getloginAdmin = (req, res, next) => {
    Admin.Admin.find({}).exec((err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({
            status: true,
            data: data
        });
    })
}

const PollCandidateAndData = (req, res, next) => {
    // console.log(req.body)
    const PollCandi = new PollData.PollData({
        id: uniqid(),
        voteLength: 0,
        pollNum: req.body.pollNum,
        timeStart: req.body.timeStart,
        timeEnds: req.body.timeEnds,
        dates: req.body.dates,
        candidateDetail: req.body.candidateDetail
    });
    // console.log('PollCandiPollCandi', PollCandi)
    PollCandi.save((err, data) => {
        if (err) {
            console.log(err)
        }
        // io.emit('message', data);
        res.status(200).send({
            status: true,
            data: data
        });
    })
}
const getPollCandidateAndData = (req, res, next) => {
    const pollnum = req.params.poll;
    PollData.PollData.find({ pollNum: pollnum }).exec((err, data) => {
        if (err) {
            console.log(err)
        }
        res.status(200).send({
            status: true,
            data: data
        });
    })
}
const getPollCandidateAndOnlyData = (req, res, next) => {
    PollData.PollData.find({}).exec((err, data) => {
      // console.log(data)
        data = data.map((v, k, arr) => {
            const result = v.candidateDetail.map((v, k, arr) => {
               
                // if (arr[k + 1] == undefined) {
                //     k--;
                // }
                // var re = Math.max(arr[k].numOFVote, arr[k + 1].numOFVote);
                // if (v.numOFVote == re) {
                //     return { name: v.name, numvote: re }
                // }
                let max = arr[0].numOFVote;
                for (let i = 1; i < arr.length; i++) {
                    if (arr[i].numOFVote > max) { //not just before 'array[i-1]'
                        max = arr[i].numOFVote;
                    }
                }
                if (v.numOFVote == max) {
                    return { name: v.name, numvote: max }
                }

            }).filter((v,k,arr) => {
                //console.log('ggggggggggggg', v)
                return v !== undefined;
            });

            //console.log(result)
            v.result = result[result.length-1];
            return v;
        });
      console.log('resultresultresultresult', data)
        if (err) {
            console.log(err)
        }

        res.status(200).send({
            status: true,
            data: data
        });
    })
}
const pollResultData =  async (req, res, next) => {
    // const removeRelatedPoll = await PollData.PollData.findByIdAndDelete({_id: ""})
    console.log(req.body.pollIdnum);
    PollData.PollData.find({ pollNum: req.body.pollIdnum}).exec((err, data) => {
        if (err) {
            console.log(err)
        }
        let tie = false;
        const totalVotes = data[0].candidateDetail.reduce((v,v1,k,arr) => {
            return (v.numOFVote || 0) + (v1.numOFVote || 0)
        }, 0);
        let wholeading = 0;
        let storeBothCandVal = [];
        data[0].candidateDetail.forEach((v,k,arr) => {
            
            if(v.numOFVote === 0) {
                tie = true;
            }
            storeBothCandVal.push(v.numOFVote);
            if(v.numOFVote > wholeading){
                wholeading = v.numOFVote
            }
        });
        const whoLeads = data[0].candidateDetail.map((v,k,arr) => {
            if(v.numOFVote === wholeading){
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', v)
                if(v !== null) {
                    return v 
                }
            }
        }).filter((v,k,arr) => {
            //console.log('ggggggggggggg', v)
            return v !== undefined;
        });
        // console.log('ggggggggggggg', whoLeads)
        const maxVal = Math.max(...storeBothCandVal);
        const minVal = Math.min(...storeBothCandVal);
        const soretedValnumVotes = storeBothCandVal = storeBothCandVal.toString().split(',').map((v,k,arr) =>{
            v = v.length === 1 ? '0'+v : v;
            return v;
            }).sort().map((v,k,arr) => parseInt(v,10));
        const howmanyLeadindex = storeBothCandVal.findIndex((v,k,arr) => {
            return v === maxVal;
        })
        const nearByVal = soretedValnumVotes[howmanyLeadindex - 1];
        const howmanyLead = maxVal - nearByVal;
        const PollResults = new PollResult.PollResult({
            pollNum: data[0].pollNum,
            totalVotes: totalVotes,
            whoLead: whoLeads[0].name,
            voteLeadNum: howmanyLead,
            tie: tie,
            expireTime: new Date()
        });
        // console.log('PollCandiPollCandi', PollResults)
        PollResults.save((err, data) => {
            if (err) {
                console.log(err)
            }
            // io.emit('message', data);
            res.status(200).send({
                status: true,
                data: data
            });
        })
    })
  
}
const deletePollDepId = (req, res, next) => {
    PollData.PollData.findOneAndDelete({pollNum: req.body.pollNum}).exec((err, data) => {
        if(err) {
            console.log(err)
        }
        return res.status(200).send ({
            status: true,
            msg: 'sucesfully remove poll',
            data: data
        })
    })
}
const allPollDataResults = (req, res, next) => {
    PollResult.PollResult.find({}).exec((err, data) => {
        if(err) {
            console.log(err)
        }
        console.log('whole Data', data)
        data = data.map((v,k) => {
            if(v.totalVotes === 0 && v.voteLeadNum==='NaN') {
                v.whoLead = 'N / A';
                v.voteLeadNum = 'N / A'
                return v;
            } else {
                return v;
            }
        }).filter((v,k) => {
            return v != undefined;
        })
        return res.status(200).send({
            status: true,
            data: data
        })
    })
}
// "5e1ffb250489ab6844c3ac95"
module.exports = {
    loginAdmin,
    PollCandidateAndData,
    getloginAdmin,
    getPollCandidateAndData,
    getPollCandidateAndOnlyData,
    checkLoginAdmin,
    adminLogout,
    pollResultData,
    deletePollDepId,
    allPollDataResults
}