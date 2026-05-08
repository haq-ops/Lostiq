const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

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

    // 🔔 Notification — item owner-க்கு notify பண்ணு
    await Notification.create({
      user: item.postedBy,
      title: 'New Claim Received! 📋',
      message: `Someone claimed your item: "${item.title}"`,
      type: 'claim',
      link: `/items/${item._id}`
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

      // 🔔 Notification — claim பண்ணவருக்கு notify பண்ணு
      await Notification.create({
        user: claim.claimedBy,
        title: 'Claim Approved! ✅',
        message: `Your claim for "${claim.item.title}" has been approved!`,
        type: 'claim',
        link: `/items/${claim.item._id}`
      });
    }

    if (req.body.status === 'rejected') {
      // 🔔 Notification — rejected-க்கும் notify பண்ணு
      await Notification.create({
        user: claim.claimedBy,
        title: 'Claim Rejected ❌',
        message: `Your claim for "${claim.item.title}" was rejected.`,
        type: 'claim',
        link: `/items/${claim.item._id}`
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