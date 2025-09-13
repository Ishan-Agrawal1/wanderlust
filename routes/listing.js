const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

//validate listing
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }else{
        next();
    }
}

//index route
router.get("/", validateListing, wrapAsync(async (req,res,next)=>{
    const listings = await Listing.find();
    res.render("listings/index", { listings });
}));

//New route
router.get("/new", (req,res)=>{
    res.render("listings/new");
});

//show route
router.get("/:id", validateListing, wrapAsync(async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/show", { listing });
}));

//new route
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    if(!req.body.listing || Object.keys(req.body.listing).length === 0) {
        return next(new ExpressError(400, "Listing data is required"));
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", validateListing, wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }

    Object.assign(listing, req.body.listing);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//destroy route
router.delete("/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    res.redirect("/listings");
}));

module.exports = router;
