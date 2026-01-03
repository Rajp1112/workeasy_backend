// auth-router.js
import {
  home,
  register,
  login,
  user,
  fetchWorkers,
  updateAvailability,
} from '../controllers/auth-controllers.js';

import {
  authMiddleware,
  authorizeRoles,
} from '../middleware/auth-middleware.js';
import { upload } from '../utils/upload.js';
import express from 'express';

const router = express.Router();

// Public
router.route('/').get(home);
// router.route('/register').post(upload.single('profileImage'), register);
router.route('/register').post(register);

router.route('/login').post(login);

// Protected
router.route('/user').get(authMiddleware, user);
router.get('/workers', authMiddleware, fetchWorkers);
router.put('/workers/availability', updateAvailability);
router
  .route('/admin')
  .get(authMiddleware, authorizeRoles('admin'), (req, res) => {
    res.json({ msg: 'Welcome Admin 🚀' });
  });

export default router;
