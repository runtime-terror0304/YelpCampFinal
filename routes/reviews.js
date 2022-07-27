const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {campgroundSchema, reviewSchema} = require('../schemas');
const { join } = require('path');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');


//now express router we know that likes to keep the params separate and in order to merge them, so as to ask the router to merge the params from app.js as well as yaha k params along with them...
//uss dikkat ki vajah se yeh ho raha tha ki jo id hai campground ki woh access nahi ho rahi thi on this side of the equation i.e reviews.js wali router file.
const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn,validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;