
const adminController = require('../controller');
const { isAutenticated } = require('../../../middleware/auth');
const routes = (router) => {
    router.post('/login-admin', adminController.loginAdmin);
    router.post('/check-login-admin', adminController.checkLoginAdmin);
    router.get('/get-login-admin', adminController.getloginAdmin);
    router.post('/add-poll-data', adminController.PollCandidateAndData);
    router.get('/get-byPoll/:poll', adminController.getPollCandidateAndData);
    router.get('/get-byPoll-only', adminController.getPollCandidateAndOnlyData);
    router.get('/admin-logout', isAutenticated, adminController.adminLogout);
    router.post('/poll-result',  adminController.pollResultData);
    router.post('/poll-delete',  adminController.deletePollDepId);
    router.get('/all-poll-data-result',  adminController.allPollDataResults);
    
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