const mongoose = require('mongoose');

const Review = require('./review');

//here we have used a different ImageSchema just because we need to have virtual property to get a thumbnail but that we could only add to whole campgroundSchema and we want a particular image to have this property so we created a different ImageSchema.
const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    //we just used the cloudinary API to give resized image thumbnails, we just tweaked the url of the image that we already had in the mongo storage and then we returned that URL to display the smaller version of those images to not load big images everytime we try to display em.
    return this.url.replace('/upload', '/upload/w_200');    
})

//mongoose jo bhi document deti hai, ussko jab JSON.stringify kro, toh virtuals ussmei include noi hotte...so woh krne k liye,yeh opts pass krte schema definition k sath.
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}...</p>`;
});

//mongoose middleware that has been set to delete the associated reviews just in case when we delete any campground.
//middleware k hooks vary krte hai and findByIdAndDelete ka hook yehi hai findOneAndDelete aur agr kissi aur method se remove hota hai campground, toh yeh middleware run nahi hoga.
campgroundSchema.post('findOneAndDelete', async (data) => {
    if(data)
    {
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;