
const userController = require('../controller');
const routes = (router) => {
    router.post('/create-register', userController.createRegister);
    router.get('/register', userController.isAutenticated, userController.getRegister);
    router.get('/authenticateds', userController.isAutenticated, userController.userchecked);
    router.post('/selected-poll', userController.isAutenticated, userController.selectedPoll);
    router.put('/give-vote', userController.isAutenticated, userController.givenToVote);
    router.get('/logout', userController.isAutenticated, userController.logoutUser);
    // router.post('/give-vote', userController.isAutenticated, userController.givenToVote);
    return router;
};

// "username": "mehulpatel",
//     "email": "mm@gmail.com",
//         "phoneNumber": "12340",
//             "birthDate": "jjjj",
//                 "password": "mMehul123456"

module.exports = {
    routes
}