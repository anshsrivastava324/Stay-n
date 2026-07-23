const Joi = require('joi');
const Listing = require('./models/listing');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().min(2).max(30).required(),
        price: Joi.number().min(0).required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }).unknown(true),
        category: Joi.string().required(),
    }).required()
});

module.exports = {listingSchema};

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});