const User = require('../models/user');

module.exports.renderRegister = (req, res) =>{
    res.render('users/register');
}

module.exports.register = async(req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({
            email,
            username
        })

        //register is the instance method that has been added to our model using passport-local-mongoose Plugin
        const registeredUser = await User.register(user, password);
        
        //here, after registering, i want the user to be logged in...so login route mei toh passport.authenticate does this and logs in the user but yaha we will use the function passport.login.
        req.login(registeredUser, err => {
            if(err)
            {
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

        // console.log(registeredUser);
    }
    catch(err)
    {
        //passport-local checks if the username is unique and gives an error message when not...so uss ko hum handle kr rahe...by flashing the error thrown by passport local and redirecting back to the register page..rather than using the error handling middleware and showing a different error page.
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    //agar toh seedha login kr k aya hai user toh session mei returnTo nahi hoga so tab toh koi point nahi hai returnTo dekhne ka...simply bhej do home page pe
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //this is how we delete something from an object
    delete req.session.returnTo;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    //this function is added automatically to the request object...by the passport
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}