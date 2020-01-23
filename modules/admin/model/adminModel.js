const mongoose = require('mongoose');
const uniqid = require('uniqid');
const options = {
    discriminatorKey: 'userType',
};

const schemas = new mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    }
});

const pollSchemas = new mongoose.Schema({
    pollNum: {
        type: Number
    },
    timeStart:{
        type: String
    },
    timeEnds:{
        type: String
    },
    dates: {
        type: String
    },
    winner: {
        winName: {
            type: String
        },
        totalVotes: {
            type: Number
        },
        leading: {
            type: String
        }
    },
    result: {
        name: {
            type: String
        },
        numvote: {
            type: String
        }
    },
    // candidateName: {
    //     type: Array
    // }
    candidateDetail: [{
        id: {
            type: String
        },
        voteLength: {
            type: Number
        },
        numOFVote: {
            type: Number,
            default: 0
        },
        name: {
            type: String
        },
        img: {
            type: String
        },
        profession: {
            type: String
        },
        skill: {
            type: String
        },
        description: {
            type: String
        },
        publicOpinion: {
            type: String
        }
    }]
});
const pollSchemasResult = new mongoose.Schema({
    pollNum: {
        type: String
    },
    totalVotes: {
        type: Number
    },
    whoLead: {
        type: Object
    },
    voteLeadNum: {
        type: String
    },
    tie: {
        type: Boolean,
        default: false
    },
    expireTime: {
        type: String
    }
})
const Admin = mongoose.model('Admin', schemas);
const PollData = mongoose.model('PollData', pollSchemas);
const PollResult = mongoose.model('PollResult', pollSchemasResult);


module.exports = {
    Admin,
    PollData,
    PollResult
};
