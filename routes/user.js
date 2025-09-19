const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');
const { Strategy } = require('passport-local');
const { redirectUrl, saveRedirectUrl } = require('../middleware.js');

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        await req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Registered successfully! Welcome to Wanderlust " + username);
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get('/login', (req,res)=>{
    res.render("users/login");
});

router.post('/login', saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash:true,
      failureRedirect:"/login"
    }), async(req,res)=>{
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);        
});

router.get('/logout', (req, res, next) => {
    req.logout((err) =>{
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports = router;