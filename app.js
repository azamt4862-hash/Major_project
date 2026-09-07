require("dotenv").config();
if(process.env.NODE_ENV  !="production"){
    require('dotenv').config()
}
const express = require("express");
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const { isloggedin } = require("./middleware.js");
const dburl = process.env.ATLASDB_URL ;

main();
async function main() {
      await mongoose.connect(dburl);
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 3600,
    crypto: {
        secret: process.env.SECRET,
    }
});
store.on("error", function(e){
    console.log("session store error", e);
});
const sessionoptions = ({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
}); 

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currentUser = req.user;
    next();
})
app.get("/registerUser", async(req, res)=>{
    let fakeuser = new User({
        email: "alikbar@gamil.com",
        username: "ali_akbr"
    })
    let registeredUser = await User.register(fakeuser, "helloworld");
    res.send(registeredUser);
})

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);   

app.get("/", (req, res) => {
    res.redirect("/listings");
});

 
 
 
 
// app.get("/testlisting", async(req, res)=>{
//     let sampleListing = new listing({
//         title: "my new home ",
//         description: "by the road",
//         price: 2345,
//         location: "kp, barikab",
//         country: "pakistan",
//     })
//    await sampleListing.save();
//    console.log("sample was save");
//    res.send("successfull testing");

// })
app.use((req, res, next)=>{
    next(new expressError(404, "page not found"));
});
app.use((err, req, res, next) => {
 let {statuscode = 500, message = "something went wrong"} = err;
 res.status(statuscode);
 res.render("err.ejs" , {message});
});
// getting-started.js
app.listen(3000, (req, res)=>{
    console.log("app is listening on 3000")
})