const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Create a claim
// @route   POST /api/claims
const createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Can't claim your own item
    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own item' });
    }

    // Check if already claimed by this user
    const alreadyClaimed = await Claim.findOne({
      item: itemId,
      claimedBy: req.user._id
    });
    if (alreadyClaimed) {
      return res.status(400).json({ message: 'You already submitted a claim for this item' });
    }

    const claim = await Claim.create({
      item: itemId,
      claimedBy: req.user._id,
      message
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all claims for an item
// @route   GET /api/claims/:itemId
const getClaimsForItem = async (req, res) => {
  try {
    const claims = await Claim.find({ item: req.params.itemId })
      .populate('claimedBy', 'name email phone city')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my claims
// @route   GET /api/claims/myclaims
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate('item', 'title type category location status')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject a claim
// @route   PUT /api/claims/:id
const updateClaimStatus = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Only item owner can approve/reject
    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    claim.status = req.body.status;
    await claim.save();

    // If approved, mark item as resolved
    if (req.body.status === 'approved') {
      await Item.findByIdAndUpdate(claim.item._id, {
        status: 'resolved',
        claimedBy: claim.claimedBy
      });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClaim,
  getClaimsForItem,
  getMyClaims,
  updateClaimStatus
};