const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');
const { Strategy } = require('passport-local');

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash("success", "Registered successfully! Welcome to Wanderlust");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get('/login', (req,res)=>{
    res.render("users/login");
});

router.post('/login',
    passport.authenticate("local", {
      failureFlash:true,
      failureRedirect:"/login"
    }), async(req,res)=>{
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
});

module.exports = router;