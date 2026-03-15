import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Message from '../models/Message.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const getUsersForChat = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const users = await Student.find(
      { _id: { $ne: userId } },
      'name email'
    ).sort({ name: 1 });

    const payload = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
    }));

    return res.status(200).json({ users: payload });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { userId, peerId } = req.query;

    if (!userId || !peerId) {
      return res.status(400).json({ error: 'userId and peerId are required' });
    }

    if (!isValidObjectId(userId) || !isValidObjectId(peerId)) {
      return res.status(400).json({ error: 'Invalid userId or peerId' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: peerId },
        { senderId: peerId, recipientId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(300);

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
};

export const sendDirectMessage = async (req, res) => {
  try {
    const { senderId, recipientId, text } = req.body;

    if (!senderId || !recipientId || !text) {
      return res.status(400).json({ error: 'senderId, recipientId and text are required' });
    }

    if (!isValidObjectId(senderId) || !isValidObjectId(recipientId)) {
      return res.status(400).json({ error: 'Invalid senderId or recipientId' });
    }

    const messageText = String(text).trim();
    if (!messageText) {
      return res.status(400).json({ error: 'Message text cannot be empty' });
    }

    const [sender, recipient] = await Promise.all([
      Student.findById(senderId),
      Student.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'Sender or recipient not found' });
    }

    const message = await Message.create({
      senderId,
      recipientId,
      text: messageText,
    });

    return res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
};
