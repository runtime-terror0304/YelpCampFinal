const mongoose = require('mongoose');
const cities = require('./cities');
const {places} = require('./seedHelpers');
const {descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Mongo Connection Success!');
}).catch((err) => {
    console.log('Oh no error!');
    console.log(err);
});

//function to give a random value from the array passed.
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

//seedDB function which deletes all the elements already existing in the DB and adds new dummy ones.
const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<300; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 30;
        const camp = new Campground({
            author: '62da15de2012d96048453f25',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/daypc8keo/image/upload/v1658597723/YelpCamp/btpl4lrvlvllzo9ktojn.jpg',
                  filename: 'YelpCamp/btpl4lrvlvllzo9ktojn'
                },
                {
                  url: 'https://res.cloudinary.com/daypc8keo/image/upload/v1658597732/YelpCamp/uek9degvegsvrfuhyhda.jpg',
                  filename: 'YelpCamp/uek9degvegsvrfuhyhda'
                }
            ],
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude]},
            description: 'Bahutte badhinya jagah hai. Yaha aakr baith kr dekhiye...majja ayega.',
            price: price
        })
        await camp.save();
    }
};

seedDB().then(()=>{
    console.log('Database seeded!');
    mongoose.connection.close();
})