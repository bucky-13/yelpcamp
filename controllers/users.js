const User = require('../models/user');

//***********VIEW REGISTER NEW USER */

module.exports.showRegisterNewUser = (req, res) => {
    res.render('users/register')
}

//***********POST REGISTER NEW USER */

module.exports.postNewUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//***********VIEW LOGIN */

module.exports.loginUser = (req, res) => {
    res.render('users/login')
}

//************POST LOGIN

module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//************LOGOUT

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }

        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}