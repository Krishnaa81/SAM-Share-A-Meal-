const MenuItem = require('../models/MenuItem');
const { validateObjectId } = require('../utils/validation');

// @desc    Get all menu items with filters
// @route   GET /api/menu-items
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const {
      category,
      restaurant,
      cloudKitchen,
      isVegetarian,
      isVegan,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (restaurant) filter.restaurant = restaurant;
    if (cloudKitchen) filter.cloudKitchen = cloudKitchen;
    if (isVegetarian) filter.isVegetarian = isVegetarian === 'true';
    if (isVegan) filter.isVegan = isVegan === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const total = await MenuItem.countDocuments(filter);

    // Get menu items with pagination and sorting
    const menuItems = await MenuItem.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('restaurant', 'name')
      .populate('cloudKitchen', 'name')
      .populate('reviews', 'rating comment');

    res.json({
      menuItems,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top selling menu items
// @route   GET /api/menu-items/top-selling
// @access  Public
const getTopSellingItems = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const menuItems = await MenuItem.find({ isAvailable: true })
      .sort('-orderCount -revenue')
      .limit(Number(limit))
      .populate('restaurant', 'name')
      .populate('cloudKitchen', 'name');

    res.json(menuItems);
  } catch (error) {
    console.error('Get top selling items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get menu item by ID
// @route   GET /api/menu-items/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }

    const menuItem = await MenuItem.findById(id)
      .populate('restaurant', 'name')
      .populate('cloudKitchen', 'name')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name profilePicture'
        }
      });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Get menu item by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu-items
// @access  Private (Restaurant/Cloud Kitchen Owner)
const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem({
      ...req.body,
      [req.user.role === 'restaurant' ? 'restaurant' : 'cloudKitchen']: req.user._id
    });

    const savedMenuItem = await menuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private (Restaurant/Cloud Kitchen Owner)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check ownership
    const ownerField = req.user.role === 'restaurant' ? 'restaurant' : 'cloudKitchen';
    if (menuItem[ownerField].toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private (Restaurant/Cloud Kitchen Owner)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check ownership
    const ownerField = req.user.role === 'restaurant' ? 'restaurant' : 'cloudKitchen';
    if (menuItem[ownerField].toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await menuItem.remove();
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMenuItems,
  getTopSellingItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
}; 