const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { sendMatchEmail } = require('../utils/emailService');

// @desc    Create a new item post
// @route   POST /api/items
const createItem = async (req, res) => {
  try {
    const { type, title, description, category, location, date } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      date,
      images,
      postedBy: req.user._id
    });

    // 📧 Found item post பண்ணும்போது
    if (type === 'found') {
      const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

      console.log('🔍 Found item posted!');
      console.log('Category:', category);
      console.log('City:', parsedLocation?.city);

      const matchingLostItems = await Item.find({
        type: 'lost',
        status: 'open',
        category: category,
        'location.city': parsedLocation?.city
      }).populate('postedBy', 'name email');

      console.log('📋 Matching lost items found:', matchingLostItems.length);

      for (const lostItem of matchingLostItems) {
        console.log('👤 Lost item owner email:', lostItem.postedBy?.email);

        if (lostItem.postedBy?.email) {
          try {
            await sendMatchEmail(
              lostItem.postedBy.email,
              lostItem.postedBy.name,
              item,
              lostItem
            );
            console.log('📧 Email sent to:', lostItem.postedBy.email);
          } catch (emailError) {
            console.error('❌ Email error:', emailError.message);
          }

          try {
            await Notification.create({
              user: lostItem.postedBy._id,
              title: '🎉 Possible Match Found!',
              message: `Someone found a ${category} in ${parsedLocation?.city} — might be yours!`,
              type: 'system',
              link: `/items/${item._id}`
            });
            console.log('✅ Notification created for:', lostItem.postedBy.email);
          } catch (notifError) {
            console.error('❌ Notification error:', notifError.message);
          }
        }
      }
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('❌ createItem error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all items with search & filter
// @route   GET /api/items
const getItems = async (req, res) => {
  try {
    const { type, category, city, status, search } = req.query;

    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('postedBy', 'name email phone city')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email phone city');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's items
// @route   GET /api/items/myitems
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems
};