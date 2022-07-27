//we use environment variables because we don't want to hardcode our API secrets which can be risky to share!

//this states that ki agar production environment nahi hai, development environment hai toh .env files k environment variables ko include kar lo yaha. in process.env
if(process.env.NODE_ENV !== "production"){
    //looks for a file with name .env
    require('dotenv').config();
}
//here we will have the access of the environment variables specified in .env file
// console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Joi =  require('joi');
const methodOverride = require('method-override');
const { join } = require('path');
const e = require('express');
const { validate } = require('./models/campground');
const {campgroundSchema, reviewSchema} = require('./schemas');
const Review = require('./models/review');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//url for using mongo atlas as the cloud-based database because this application will not be running on our machine, but it will run on some server...for this we had to setup mongo Atlas.

const app = express();

// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Mongo Connection Success!');
}).catch((err) => {
    console.log('Oh no error!');
    console.log(err);
})

//this is how we put ejsMate to use...that is engine ejs hi hai but uska ejsMate wala version hai.
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

//public folder ko statically host kr diya hai.
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    //this here is touchAfter which means ki save mat kro after each and every time user refreshes agar session mei koi change nahi ho...apne aap save kro session ko dubara after 24 hours as yeh seconds mei given hota...spo 24 hours, 60 minutes in 1 hour and 60 seconds in one minute.
    touchAfter: 24*60*60
})

store.on("error", function(err){
    console.log("Session Store Error", err);
})

//configuring the session for flash messages
const sessionConfig = {
    //yaha jo uppr store banaya mongodb ka woh pass kar diya sessionConfig mei so that we can use it as our store and not the local storage.
    store,
    //here, we are giving this name instead of connect.sid because that is the default name for the session key cookie and we want ki yeh attacker k liye obvious na ho jaye ki yehi cookie chahiye for session so we give it another name.
    name: 'session',
    secret: secret,
    //yeh niche wale 2 options are for the depracation errors.
    resave: false,
    saveUninitialized: true,
    cookie:{
        //httpOnly is security measure used against cross site scripting or client side script bhi access nahi kr skti cookie ko.
        httpOnly: true,
        //yeh localhost pe nahi but jab deploy krnge tab isey set krenge..this ensures that cookie https wale network pe hi rahe.
        //secure: true,
        //yaha bas set kr diya ki jo cookie bheji woh after a week expire ho jayegi...Date.now() jo hai woh milliseconds mei hota so 1 sec mei 1000 milli aur fir 1 minute mei 60 and so on kr k week banaya hai milli seconds mei.
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: (1000*60*60*24*7)
    }   
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({crossOriginEmbedderPolicy: false}));

//these are the urls that i want to use other than self as source of different things like images, fonts, scripts etc...so we have to specify the allowed urls so as to configure the contentSecurityPolicy of the helmet.
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

//here we are configuring the contentSecurityPolicy of the helmet so as to allow things from the resources/urls mentioned above.
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/daypc8keo/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
//this should be after we do session(sessionConfig)
app.use(passport.session());

//yaha hum passport ko bol rahe ki LocalStrategy k liye authenticate wala function user model pr hoga, it's called authenticate...this comes from passport-local-mongoose.
passport.use(new LocalStrategy(User.authenticate()));

//serialization means how do we store the user in the session.
passport.serializeUser(User.serializeUser());

//how to deserialize that is how to un-store it in the session and yeh sb user model pe woh plugin se aya hai.
passport.deserializeUser(User.deserializeUser());

//yeh middleware bana diya hai for flash.
app.use((req, res, next) => {

    //mongo-injection bhi sql injection ki tarah hota jissmei hum koi form k through syntax bhej dete mongo query ka and then ussey hum database mei malicious changes kr skte...so iska ilaaaj yehi hai kisi bhi trah se...that is req ki body, params, query string aur headers kahi se bhi mongo ka syntax na bhej ske...jaise $, .(period) etc jaise characters allow nahi karega in keys of any of request params, body etc.
    mongoSanitize();

    console.log(req.session);

    //yaha pe req.user jo bhi hoga woh locals mei dal rahe taki har template mei access ho.
    //isske alawa aur mei yeh kar skta tha ki har render mei bhejta current user aur woh hota agar toh sirf logout show krta...woh kafi ganda ho jata na
    res.locals.currentUser = req.user;

    //yaha keh raha hu ki jo bhi req.flash mei under success ho woh res.locals.success mei dal lo so as to access it in all the views.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    return next();
})

app.get('/', (req, res) => {
    res.render('home');
})

// app.get('/fakeUser', async(req,res) => {
//     const user = new User({
//         email: 'coltttt@gmail.com',
//         username: 'colttt'
//     })

//     //takes user model instance and password then hash it and then stores the password and the salt on our user  and it takes time.
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.use('/', userRoutes);

app.use('/campgrounds', campgroundRoutes);

//yaha pe params prefix kr k rakhe hai hummne but express router likes to keep the params separate.
app.use('/campgrounds/:id/reviews', reviewRoutes);

//this is the 404 or not found route handler.
app.all('*', (req, res, next) => {
    return next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something went wrong!';
    }
    res.status(statusCode).render('error', {err});
})

app.listen(3000, (req, res) => {
    console.log('Listening on port 3000');
})