const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview = async (req, res, next) => {
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
}

module.exports.destroyReview = async (req, res, next) => {
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
}