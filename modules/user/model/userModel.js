const mongoose = require('mongoose');
const options = {
    discriminatorKey: 'userType',
};

const schemas = new mongoose.Schema({
    name: {
        type: String
    },
    GovermentId: {
        idType: {
            type: String
        },
        number: {
            type: String
        },
    },
    birthDate: {
        type: String
    },
    voteForPollNum: {
        type: Number
    },
    voteForCandidate: {
        type: String
    }
});

const User = mongoose.model('User', schemas);

module.exports = {
    User
};
