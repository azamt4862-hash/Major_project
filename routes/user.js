const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersController = require("../controllers/users.js");

const wrapAsync = require("../utils/wrapAsync");

router.route("/signup")
    .get(usersController.rendersignupForm)
    .post(wrapAsync(usersController.signup));


// router.get("/signup", usersController.rendersignupForm);

// router.post("/signup", wrapAsync( usersController.signup));
router.route("/login")
    .get(usersController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureFlash: true, failureRedirect: "/login"
    }),
    usersController.login
    );

// router.get("/login", usersController.renderLoginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate("local", {
//     failureFlash: true, failureRedirect: "/login"
// }),
// usersController.login
// );

router.get("/logout", usersController.logout);

module.exports = router;