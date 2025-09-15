const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

const sessionOptions = {
    secret: "mysecretkey", 
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24, // 1 day
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
    }
};

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session(sessionOptions));
app.use(flash());

const MONGO_URL = "mongodb://127.0.0.1/wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//default route
app.get("/", (req,res)=>{
    res.send("Welcome to WanderLust! Go to /listings to see all listings.");
});

// Use listing routes
app.use("/listings", listingRoutes);

// Use review routes
app.use("/listings/:id/reviews", reviewRoutes);

//catch-all route for undefined routes
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