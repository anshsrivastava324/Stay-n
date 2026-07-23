const Listing = require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({accessToken: mapToken});

const buildSearchQuery = (searchText = "") => {
    const trimmedSearchText = searchText.trim();

    if (!trimmedSearchText) {
        return {};
    }

    const escapedSearchText = trimmedSearchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearchText, "i");

    return {
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
        ],
    };
};

module.exports.index = async (req, res) => {
    const { category, searchText = "" } = req.query;
    const query = {};

    if (category) {
        query.category = category;
    }

    Object.assign(query, buildSearchQuery(searchText));

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, category });
};

module.exports.searchListings = async (req, res) => {
    const { searchText = "" } = req.query;
    const searchQuery = buildSearchQuery(searchText);

    if (Object.keys(searchQuery).length === 0) {
        const allListings = await Listing.find({});
        return res.json(allListings);
    }

    const allListings = await Listing.find(searchQuery);

    res.json(allListings);
};

module.exports.renderNewForm = async (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist !");
        res.redirect("/listings");
    }
    else{
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.createListing = async(req,res)=>{

    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    //let {title, description, image, price, country, location} = req.body;   //basic way
    const newListing= new Listing(req.body.listing);  //this will store details in form of object as we used name="listing[name]" in new.ejs form, so they all come under listing object
    newListing.geometry = response.body.features[0].geometry;
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist !");
        res.redirect("/listings");
    } else{
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); //reducing pixels so that it doesn't take much time to load img
        res.render("listings/edit.ejs", {listing, originalImageUrl});
    }
};

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});  //three dots bcz we're deconstructing the req.body.listing

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }
    
    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

