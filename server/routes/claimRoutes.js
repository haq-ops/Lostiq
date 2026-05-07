const express = require('express');
const router = express.Router();
const {
  createClaim,
  getClaimsForItem,
  getMyClaims,
  updateClaimStatus
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createClaim);
router.get('/myclaims', protect, getMyClaims);
router.get('/:itemId', protect, getClaimsForItem);
router.put('/:id', protect, updateClaimStatus);

module.exports = router;