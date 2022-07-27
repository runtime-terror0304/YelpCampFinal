const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    // console.log('iss route pe aa raha hu');
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    console.log('yaha aya toh sahi');
    const {id, reviewId} = req.params;
    //here we could have used any logic but we are using the pull operator to remove all the instances from an existing array of the review elements that match reviewId that we have passed.
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}
