const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.createListing)
  );

//new route
router.get("/new", ListingController.renderNewForm);

//Show,update,delete
router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(ListingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditListing)
);

module.exports = router;