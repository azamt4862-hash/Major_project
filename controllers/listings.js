const Listing = require("../models/listing");
// module.exports.index = async(req, res)=>{
//     const alllistings = await Listing.find({});
//     res.render("listings/index.ejs", {alllistings});
// };

module.exports.index = async (req, res) => {
    let { category } = req.query; // get category from URL

    let alllistings;

    if (category) {
        // filter listings by category
        alllistings = await Listing.find({ category: category });
    } else {
        // show all listings
        alllistings = await Listing.find({});
    }

    res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",
         populate: {path: "author"}}).populate("owner");
    if(!listing){
            req.flash("error", "Listing you requested for does not exist!");
           return   res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};
module.exports.createListing = async(req, res)=>{
   let url = req.file.path;
   let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New listing is created");
    res.redirect("/listings")
};
module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
            req.flash("error", "Listing you requested for does not exist!");
           return   res.redirect("/listings");
    }
        req.flash("success", "Listing is edited");
        let originalImageurl = listing.image.url;
        originalImageurl = originalImageurl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageurl});
};

module.exports.upsdateListing = async(req, res)=>{
 let {id}= req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if(typeof req.file !== "undefined"){    
    let url = req.file.path;
   let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
       req.flash("success", "Listing is updated");
   res.redirect(`/listings/${id}`);
 };

 module.exports.destroyListing = async(req, res) =>{
        let {id}= req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
       console.log(deletedListing);
           req.flash("success", "Listing is deleted");
       res.redirect("/listings");
};