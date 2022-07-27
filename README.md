
# Yelpcamp

The Yelpcamp project is essentially a copy of the Yelp.com website, which only displays campgrounds.


## Features

- Any user can view all the campgrounds on this website without even logging in.
- A user who has signed up or logged in can add new campgrounds and enter information about them, including their name, description, location, costs and Images.
- Only the campgrounds that the logged-in or registered user has added can be edited or deleted by him/her.
- A registered/logged-in user may remark on the currently available campgrounds and may only remove his/her own comments.
- On the page that provides information on a specific campground, this website displays the location of that campground on a map. The index page also features a cluster map that displays the locations of campground clusters.
- Full authentication and authorization has been implemented in this project. 
- It has been deployed on heroku and can be accessed using the given link: https://radiant-harbor-59780.herokuapp.com/
## Authors

- [@RachitPuri](https://github.com/runtime-terror0304)


## Tech Stack

**Server:** Node.js, Express.js.

**Server Responses:** EJS templates.

**Styling and appearance:** CSS and Bootstrap.

**Database:** MongoDB, Mongoose, Mongo Atlas.

**APIs and Services used:** Cloudinary (for uploading images and getting their urls to be stored in mongo database), Mapbox (for geocoding the locations and displaying maps), Passport (for authentication), Heroku (for deployment). 


## Screenshots

### Home page
![Home page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1934).png?raw=true)

### Index page
![Index page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1936).png?raw=true)

![Index page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1937).png?raw=true)

### Login page
![Login page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1940).png?raw=true)

### Details of a particular campground(without log-in)
![Show page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1938).png?raw=true)

### Details of a particular campground(with a user logged in)
![Show page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1943).png?raw=true)

### Register page
![Register page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1946).png?raw=true)

### New campground page (with client-side validations)
![New page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1949).png?raw=true)

### Flash message after creating a new campground
![Show page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1950).png?raw=true)

### Edit campground page
![Edit page](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1951).png?raw=true)

### Cluster map popup
![Cluster map](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1952).png?raw=true)

### Server side validations (sending price as string)
![Server validations](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1960).png?raw=true)

![Server validations](https://github.com/runtime-terror0304/YelpCampFinal/blob/main/screenshots/Screenshot%20(1961).png?raw=true)