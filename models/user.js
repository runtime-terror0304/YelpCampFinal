const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//this will add on to our schema, a username and a password and it will give us some static methods to improve the functionality.
//we can look up the passport-local-mongoose docs.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);