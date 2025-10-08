const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
}

module.exports.signup = async (req, res, next) => {
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
}

module.exports.login = (req,res)=>{
    res.render("users/login");
}

module.exports.renderLoginForm = async(req,res)=>{
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);        
}

module.exports.logout = (req, res, next) => {
    req.logout((err) =>{
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}