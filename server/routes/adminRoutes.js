const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  getAllItems,
  deleteItem,
  makeAdmin
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.put('/users/:id/makeadmin', protect, adminOnly, makeAdmin);
router.get('/items', protect, adminOnly, getAllItems);
router.delete('/items/:id', protect, adminOnly, deleteItem);

module.exports = router;