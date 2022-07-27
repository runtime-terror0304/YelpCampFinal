//this is the controller file aur aese rakhte hai logic ko in the projects...jissey kehtey hai MVC format....M for models, V for views, C for controller

const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async(req, res) => {
    //calling the geocoding API of mapbox for forwaredGeocoding that is to get coordinates from the location string.
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    //geocoding mei, geometry mei longitude dete pehley, fir latitude dete but google maps pe latitude, longitude dena hota.
    // console.log(geoData.body.features[0].geometry.coordinates);
    if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    // here, we are making an object jissmei we are storing the array of objects such that one obect contains the url of the image and the filename of it.
    newCampground.images = req.files.map(f => {
        return {
            url: f.path,
            filename: f.filename
        }
    });
    // req.user mei currently logged in user hai...usski id dal di bas author mei.
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        //this is the sytax when we want to populate the campground with reviews and then further want those reviews to be populated with the author.
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    if(!campground)
    {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    if(!campground)
    {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    //when we find by id and update, when we find the document by id and then update it...the id remains the same, only the property values change.
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    const imgs = req.files.map(f => {
        return {
            url: f.path,
            filename: f.filename
        }
    });
    campground.images.push(...imgs);
    await campground.save();
    //this is the logic to delete the images from the edit form if we want to delete those images.
    if(req.body.deleteImages){
        //deleting the images from the cloudinary data using it's inbuit destroy function.
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(campground);
    }
    req.flash('success', 'Successfylly updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground!');
    res.redirect('/campgrounds');
}