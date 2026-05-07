const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getItems);
router.post('/', protect, createItem);
router.get('/myitems', protect, getMyItems);
router.get('/:id', getItemById);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;