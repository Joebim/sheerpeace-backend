const Review = require('../models/review.model');

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.getByProduct(req.params.product_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { rating, comment } = req.body;
    const [review] = await Review.create(req.user.id, product_id, rating, comment);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const [review] = await Review.update(req.params.review_id, req.user.id, req.body);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.delete(req.params.review_id, req.user.id);
    if (!review.length) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
