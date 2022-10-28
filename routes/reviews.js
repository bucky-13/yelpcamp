const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');

const Campground = require('../models/campground');

const reviewCtrl = require('../controllers/reviews')
const Review = require('../models/review');

const { isLoggedIn, validateReview, validateReviewAuthor } = require('../utilities/authMiddleware')



//*************POST A REVIEW */

router.post('/', isLoggedIn, validateReview, catchAsync(reviewCtrl.postReview))

//*********DELETE A REVIEW */

router.delete('/:reviewId', isLoggedIn, validateReviewAuthor, catchAsync(reviewCtrl.deleteReview))

module.exports = router;