const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: {
        type: String,
        default : "https://unsplash.com/photos/white-wooden-framed-glass-door-zjp79y-GGa0",
        set: (v) =>
            v === "" ? "https://unsplash.com/photos/white-wooden-framed-glass-door-zjp79y-GGa0" : v
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;