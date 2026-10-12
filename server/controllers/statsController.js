const User = require('../models/User');
const Item = require('../models/Item');

// @desc    Get public homepage stats
// @route   GET /api/stats
const getPublicStats = async (req, res) => {
  try {
    const [totalItems, reunitedItems, totalUsers] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ status: 'resolved' }),
      User.countDocuments()
    ]);

    res.json({ totalItems, reunitedItems, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPublicStats };
