const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//index route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),  
        wrapAsync(listingController.createListing)
    );

//filters
router.route("/trending")
    .get(wrapAsync(listingController.trendingListings));

router.route("/rooms")
    .get(wrapAsync(listingController.roomListings));

router.route("/iconic-cities")
    .get(wrapAsync(listingController.iconicCitiesListings));

router.route("/castles")
    .get(wrapAsync(listingController.castleListings));

router.route("/beaches")
    .get(wrapAsync(listingController.beachListings));

router.route("/mountains")
    .get(wrapAsync(listingController.mountainListings));


router.route("/farms")
    .get(wrapAsync(listingController.farmListings));

router.route("/domes")
    .get(wrapAsync(listingController.domeListings));

router.route("/arctic")
    .get(wrapAsync(listingController.arcticListings));

router.route("/houseboats")
    .get(wrapAsync(listingController.houseboatListings));

//New route
router.route("/new")
    .get(isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//edit route
router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
