import Review from '../models/review-model.js';
import { getSocketInstance } from '../utils/socket.js';

// Create a review
export const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();

    // Emit real-time event
    const io = getSocketInstance();
    io.emit('reviewCreated', savedReview);

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: savedReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByWorker = async (req, res) => {
  try {
    const { worker_id } = req.params;
    const reviews = await Review.find({ worker_id }).populate(
      'customer_id',
      'name email'
    );

    return res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );
    const io = getSocketInstance();
    io.emit('reviewUpdated', updatedReview);

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    const io = getSocketInstance();
    io.emit('reviewDeleted', reviewId);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      reviewId,
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
