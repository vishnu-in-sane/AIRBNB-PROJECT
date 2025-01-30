const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    const newReview = new Review({
      comment: req.body.review.comment,
      rating: req.body.review.rating,
    });
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Error adding review:", err);
    throw new ExpressError(500, "Failed to add review");
  }
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
