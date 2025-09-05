const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const MONGO_URL = "mongodb://127.0.0.1/wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

//default route
app.get("/", (req,res)=>{
    res.redirect("/listings");
})

//index route
app.get("/listings", wrapAsync(async (req,res,next)=>{
    const listings = await Listing.find();
    if(!listings) {
        return next(new ExpressError(404, "Listings Not Found"));
    }
    res.render("listings/index", { listings });
}));

//New route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new");
});

//show route
app.get("/listings/:id", wrapAsync(async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/show.ejs", { listing });
}));

//new route
app.post("/listings", wrapAsync(async (req, res, next) => {
    if(!req.body.listing || Object.keys(req.body.listing).length === 0) {
        return next(new ExpressError(400, "Listing data is required"));
    }

    const { error } = listingSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(400, error.details[0].message));
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    const { error } = listingSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(400, error.details[0].message));
    }

    Object.assign(listing, req.body.listing);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//destroy route
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if(!listing) {
        return next(new ExpressError(404, "Listing Not Found"));
    }
    res.redirect("/listings");
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});