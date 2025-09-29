const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controllers');
const {
  authMiddleware,
  authorizeRoles,
} = require('../middleware/auth-middleware');
const multer = require('multer');
const storage = multer.memoryStorage(); // use diskStorage if you want to save files locally
const upload = multer({ storage });

// Public
router.route('/').get(authController.home);
router
  .route('/register')
  .post(upload.single('profileImage'), authController.register);
router.route('/login').post(authController.login);

// Protected
router.route('/user').get(authMiddleware, authController.user);
router.get('/workers', authMiddleware, authController.fetchWorkers);
router.put('/workers/availability', authController.updateAvailability);
router
  .route('/admin')
  .get(authMiddleware, authorizeRoles('admin'), (req, res) => {
    res.json({ msg: 'Welcome Admin 🚀' });
  });

module.exports = router;
