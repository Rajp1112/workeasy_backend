import express from 'express';
import { getMessages } from '../controllers/message-controllers.js';

const router = express.Router();

// GET messages by room ID
router.get('/:roomId', getMessages);

export default router;
