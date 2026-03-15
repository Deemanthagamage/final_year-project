import express from 'express';
import {
  getUsersForChat,
  getConversationMessages,
  sendDirectMessage,
} from '../controllers/userChatController.js';

const router = express.Router();

router.get('/users/:userId', getUsersForChat);
router.get('/messages', getConversationMessages);
router.post('/messages', sendDirectMessage);

export default router;
