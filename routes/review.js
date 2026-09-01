const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const {listingSchema} = require("../schema.js");
const {validateReview, isloggedin, isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");
// post review route
router.post("/",isloggedin, validateReview,wrapAsync( reviewController.createReview));

// Delete review route
router.delete("/:reviewId", isloggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview));
 
module.exports = router;