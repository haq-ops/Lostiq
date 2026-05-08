const Item = require('../models/Item');
const stringSimilarity = require('string-similarity');

// @desc    Find matching items (Lost vs Found)
// @route   GET /api/ai/match/:itemId
const findMatches = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Opposite type search
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';

    // Same category items fetch பண்ணு
    const candidates = await Item.find({
      type: oppositeType,
      status: 'open',
      _id: { $ne: item._id }
    }).populate('postedBy', 'name phone city');

    if (candidates.length === 0) {
      return res.json({ matches: [] });
    }

    // Score calculate பண்ணு
    const itemText = `${item.title} ${item.description} ${item.category}`.toLowerCase();

    const scored = candidates.map(candidate => {
      const candidateText = `${candidate.title} ${candidate.description} ${candidate.category}`.toLowerCase();

      // String similarity score
      const titleScore = stringSimilarity.compareTwoStrings(
        item.title.toLowerCase(),
        candidate.title.toLowerCase()
      );

      const textScore = stringSimilarity.compareTwoStrings(itemText, candidateText);

      // Category match bonus
      const categoryBonus = item.category === candidate.category ? 0.3 : 0;

      // City match bonus
      const cityBonus = item.location?.city === candidate.location?.city ? 0.2 : 0;

      // Date proximity bonus (within 7 days)
      const itemDate = new Date(item.date);
      const candidateDate = new Date(candidate.date);
      const daysDiff = Math.abs((itemDate - candidateDate) / (1000 * 60 * 60 * 24));
      const dateBonus = daysDiff <= 7 ? 0.2 : daysDiff <= 30 ? 0.1 : 0;

      const totalScore = (titleScore * 0.4) + (textScore * 0.3) + categoryBonus + cityBonus + dateBonus;

      return {
        item: candidate,
        score: Math.min(totalScore, 1),
        percentage: Math.round(Math.min(totalScore, 1) * 100)
      };
    });

    // Sort by score, top 5 மட்டும்
    const matches = scored
      .filter(s => s.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { findMatches };