const express = require('express');
const router = express.Router({mergeParams: true}); //it merges the params from parent file(app.js) to child(review.js)
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthorReview, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//reviews-POST route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//review-delete route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;