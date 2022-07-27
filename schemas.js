        const BaseJoi = require('joi');
        const sanitizeHtml = require('sanitize-html');
        //we are using this package called sanitize HTML...to make an HTML sanitizer extension on top of JOI.
        

        //here, we are trying to prevent cross-site-scripting or XSS which is basically injecting a client-sie script and running it on the website...for example agar mei form k kissi input field mei <script></script> dal du, toh we should be able to escape that....we should get the escaped html.
        //we could use express validator instead of JOI which comes with sanitization by default.
        //we used the JOI extension...we wrote our own version on top of JOI.
        const extension = (joi) => ({
            type: 'string',
            base: joi.string(),
            messages: {
                'string.escapeHTML': '{{#label}} must not include HTML!' 
            },
            rules: {
                escapeHTML: {
                    //here we are calling this function that requires two parameters value, helpers and usske andr we are using sanitizeHtml to sanitize the HTML.
                    validate(value, helpers){
                        const clean = sanitizeHtml(value, {
                            allowedTags:[],
                            allowedAttributes: {},
                        });
                        //here we compare clean and the actual input(value) and if they are not equal, we return an error ki dikkat hai. 
                        if(clean !== value) return helpers.error('string.escapeHTML', {value})         
                        return clean                
                    }
                }
            }
        });
        //in here, we are basically using sanitizeHtml package and ussmei input jo hai woh pass kr rahe to get the HTML escaped value and fir uss ko actual se compare karne pe equal aye toh sahi otherwise dikkat!

        const Joi = BaseJoi.extend(extension);

        //this is Joi schema validation which allows us to validate the data that has been sent before sending it to mongo database or relying on mongoose errors.
        module.exports.campgroundSchema = Joi.object({
            campground: Joi.object({
                title: Joi.string().required().escapeHTML(),
                price: Joi.number().required().min(0),
                location: Joi.string().required().escapeHTML(),
                description: Joi.string().required().escapeHTML()
        }).required(),
            deleteImages: Joi.array()
        })

        module.exports.reviewSchema = Joi.object({
            review: Joi.object({
                body: Joi.string().required().escapeHTML(),
                rating: Joi.number().required().min(1).max(5),
            }).required()
        })