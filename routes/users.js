const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const userCtrl = require('../controllers/users')

//***********VIEW & POST REGISTER NEW USER */

router.route('/register')
    .get(userCtrl.showRegisterNewUser)
    .post(catchAsync(userCtrl.postNewUser))

//***********VIEW & POST LOGIN */
router.route('/login')
    .get(userCtrl.loginUser)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true,
    }),
        userCtrl.postLogin)

//************LOGOUT

router.get('/logout', userCtrl.logout);

module.exports = router;