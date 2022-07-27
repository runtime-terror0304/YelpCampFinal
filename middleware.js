const {campgroundSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground'); 
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
        //req.user mei passport data dalta hai by deserializing the serialized data in the session
        //console.log(req.user);

        //isAuthenticated is the method that is a helper method to check if the user is authenticated.
        if(!req.isAuthenticated())
        {
            //store the url being requested to the session so that jaha user ko jana tha wahi bheje once he/she logs in.
            console.log('yaha aaya');
            req.session.returnTo = req.originalUrl;

            req.flash('error', 'You must be signed in');
            return res.redirect('/login');
        }
        next();
}

//here, this is the middleware function to validate the campground data before putting it into the DB.
module.exports.validateCampground = (req, res, next) => {    
    const {error} = campgroundSchema.validate(req.body);
    // console.log(error);
    if(error)
    {
        //yaha error ek array of objects hai toh uss pr map kr k usske messages ko join kr rahe ek error message string mei separated by commas.
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        return next();
    }
    // console.log(req.body);
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;

    const campground = await Campground.findById(id);

    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }

    return next();
}

//here, this is the middleware function to validate the review data before putting it into the DB.
module.exports.validateReview = validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        return next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;

    const review = await Review.findById(reviewId);

    if(!review.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }

    return next();
}