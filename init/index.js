const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("./data.js")

const MONGO_URL = "mongodb://127.0.0.1/wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => {
        return {
            ...obj,
            owner: '68d18c0ef0498386da636843',
        };
    });
    await Listing.insertMany(initData.data);
};

initDB();