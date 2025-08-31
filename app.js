const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


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
    res.send("Welcome to Wanderlust");
})

//index route
app.get("/listings", async (req,res)=>{
    const listings = await Listing.find();
    res.render("listings/index", { listings });
});

//New route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new");
});

//show route
app.get("/listings/:id", async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    res.render("listings/show.ejs", { listing });
});

//new route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // Update each field from the form, including those that were empty before
    for (let key in req.body.listing) {
        if (listing[key] !== undefined) {
            listing[key] = req.body.listing[key];
        }else{
            listing[key] = req.body.listing[key];
        }
    }
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
});

//destry route
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});