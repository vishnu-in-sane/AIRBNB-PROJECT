const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
    res.render("index", { allListings });
};
//     try {
    
//   } catch (err) {
//     console.log("Error fetching listings:", err);
//     res.status(500).send("Error fetching listings");
//   }
// };

module.exports.renderNewForm = (req, res) => {
  res.render("new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  console.log("Listing with reviews:", listing);
  res.render("show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();
  // Get the coordinates for the location name
  const locationCoordinates = response.body.features[0].geometry.coordinates;
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  // Redirect with the coordinates to the frontend for the map
  req.flash("success", "New listing created");
  res.redirect(`/listings/${savedListing._id}?lng=${locationCoordinates[0]}&lat=${locationCoordinates[1]}`);
};

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  console.log("Listing data for edit:", listing);
  req.flash("success", "Listing Edited");
  res.render("edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
