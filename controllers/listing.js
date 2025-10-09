const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req,res,next)=>{
    const listings = await Listing.find();
    res.render("listings/index", { listings });
}

module.exports.trendingListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Trending"});
    res.render("listings/index", { listings });
}

module.exports.roomListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Rooms"});
    res.render("listings/index", { listings });
}

module.exports.iconicCitiesListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Iconic cities"});
    res.render("listings/index", { listings });
}

module.exports.castleListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Castles"});
    res.render("listings/index", { listings });
}

module.exports.beachListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Beach"});
    res.render("listings/index", { listings });
}

module.exports.mountainListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Mountains"});
    res.render("listings/index", { listings });
}

module.exports.farmListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Farms"});
    res.render("listings/index", { listings });
}

module.exports.arcticListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Arctic"});
    res.render("listings/index", { listings });
}

module.exports.domeListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Domes"});
    res.render("listings/index", { listings });
}

module.exports.houseboatListings = async (req,res,next)=>{
    const listings = await Listing.find({category: "Houseboat"});
    res.render("listings/index", { listings });
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new");
}

module.exports.showListing = async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

    if(!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res, next) => {
    if(!req.body.listing || Object.keys(req.body.listing).length === 0) {
        return next(new ExpressError(400, "Listing data is required"));
    }
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageURL });
}

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);
    if(typeof req.file !== 'undefined') {
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;
    }
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if(!listing) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}