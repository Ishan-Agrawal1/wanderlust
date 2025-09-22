const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview,isLoggedIn, isReviewAuthor } = require("../middleware.js");



//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }

    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, validateReview, wrapAsync(async (req, res, next) => {
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
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;