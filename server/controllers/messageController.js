const Message = require('../models/Message');

// @desc    Send message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiver, item, message } = req.body;

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      item,
      message
    });

    const populated = await newMessage.populate('sender', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for an item between two users
// @route   GET /api/messages/:itemId/:userId
const getMessages = async (req, res) => {
  try {
    const { itemId, userId } = req.params;

    const messages = await Message.find({
      item: itemId,
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .populate('item', 'title type')
    .sort({ createdAt: -1 });

    // Get unique conversations
    const conversations = [];
    const seen = new Set();

    messages.forEach(msg => {
      const key = `${msg.item._id}-${[msg.sender._id, msg.receiver._id].sort().join('-')}`;
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push(msg);
      }
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };