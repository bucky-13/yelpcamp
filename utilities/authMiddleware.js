//**************REQ CONSTS */

const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema, reviewSchema } = require('../JoiSchemas');
const Campground = require('../models/campground');
const Review = require('../models/review');



//****************LOGIN CHECKER */
module.exports.isLoggedIn = (req, res, next) => {
    // console.log('req.user...', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to add a modify campground.');
        return res.redirect('/login')
    }
    next();
}

//**************VALIDATION CAMPGROUNDS */

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

module.exports.validateAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campgroundValidation = await Campground.findById(id);
    if (!campgroundValidation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

//**************VALIDATION REVIEWS */

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

module.exports.validateReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const reviewValidation = await Review.findById(reviewId);
    if (!reviewValidation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
