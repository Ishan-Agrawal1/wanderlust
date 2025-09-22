const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const { validateListing } = require("../middleware.js");

//index route
router.get("/", validateListing, wrapAsync(async (req,res,next)=>{
    const listings = await Listing.find();
    res.render("listings/index", { listings });
}));

//New route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new");
});

//show route
router.get("/:id", validateListing, wrapAsync(async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

    if(!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

//new route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req, res, next) => {
    if(!req.body.listing || Object.keys(req.body.listing).length === 0) {
        return next(new ExpressError(400, "Listing data is required"));
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner,validateListing, wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

//destroy route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if(!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;
