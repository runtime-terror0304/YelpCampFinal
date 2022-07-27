const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//configuring cloudinary
//this is something not mentioned in the docs
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

//instance of cloudinary storage.
//yeh sab bhi docs mei ache se mentioned nahi hai...so yeah, we will have to refer to colt's videos to work that out.
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    } 
});

module.exports = {
    cloudinary,
    storage
}