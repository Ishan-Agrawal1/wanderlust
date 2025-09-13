const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

//validate review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }else{
        next();
    }
}

//post review route
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
    const { reviewId } = req.params;
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }

    const review = await Review.findById(reviewId);
    if(!review) {
        return next(new ExpressError(404, "Review Not Found"));
    }

    await Listing.findByIdAndUpdate(req.params.id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;