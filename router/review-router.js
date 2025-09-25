import express from 'express';
import {
  createReview,
  getReviewsByWorker,
  updateReview,
  deleteReview,
} from '../controllers/review-controller.js';

const router = express.Router();

router.post('/', createReview);
router.get('/worker/:worker_id', getReviewsByWorker);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router;
