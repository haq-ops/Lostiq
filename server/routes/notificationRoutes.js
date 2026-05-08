const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.get('/unread', protect, getUnreadCount);
router.put('/readall', protect, markAllAsRead);
router.put('/:id', protect, markAsRead);

module.exports = router;