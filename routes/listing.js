const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner, validateListing } = require("../middleware.js");
const Listingcontroller = require("../controllers/listings.js");
const listing = require("../models/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(Listingcontroller.index))
.post(isloggedin, validateListing,
    upload.single('listing[image]'),
     wrapAsync(Listingcontroller.createListing)
    );


 //new route
router.get("/new", isloggedin,Listingcontroller.renderNewForm);

router
.route("/:id")   
.get(wrapAsync(Listingcontroller.showListing))
.put(isloggedin, 
    isOwner,
     upload.single('listing[image]'), 
    validateListing,
     wrapAsync(Listingcontroller.upsdateListing))
.delete(isloggedin, isOwner, wrapAsync(Listingcontroller.destroyListing));

// index route
// router.get("/", wrapAsync(Listingcontroller.index));

router.get("/:id/edit",
    isloggedin,
    isOwner,
    wrapAsync(Listingcontroller.renderEditForm)
);

// //show route
// router.get("/:id", wrapAsync(Listingcontroller.showListing));

// // creat route
// router.post("/", validateListing, wrapAsync(Listingcontroller.createListing));

// // edit rout
// router.get("/:id/edit",
//     isloggedin,
//     isOwner,
//     validateListing,
//      wrapAsync(Listingcontroller.renderEditForm));

//  // update route
//  router.put("/:id",   isloggedin, isOwner, validateListing, wrapAsync(Listingcontroller.upsdateListing));


//  // Delete route

//  router.delete("/:id",  isloggedin, isOwner, wrapAsync(Listingcontroller.destroyListing));

module.exports = router;