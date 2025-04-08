const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { validateObjectId } = require('../utils/validation');

// @desc    Get all restaurants with filters
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const {
      name,
      city,
      cuisineType,
      isOpen,
      minRating,
      sort = '-ratings.average',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (name) {
      filter.$text = { $search: name };
    }
    
    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }
    
    if (cuisineType) {
      filter.cuisineType = { $in: Array.isArray(cuisineType) ? cuisineType : [cuisineType] };
    }
    
    if (minRating) {
      filter['ratings.average'] = { $gte: Number(minRating) };
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const total = await Restaurant.countDocuments(filter);

    // Get restaurants with pagination and sorting
    const restaurants = await Restaurant.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('name description cuisineType address images logo ratings priceRange deliveryOptions');

    // If isOpen filter is applied, filter in memory after fetching from DB
    let filteredRestaurants = restaurants;
    if (isOpen === 'true') {
      filteredRestaurants = restaurants.filter(restaurant => restaurant.isOpenNow());
    }

    res.json({
      restaurants: filteredRestaurants,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const restaurant = await Restaurant.findById(id)
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: {
          path: 'user',
          select: 'name profilePicture'
        }
      })
      .populate({
        path: 'featuredItems',
        select: 'name description price image isVegetarian ratings'
      });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get menu items for this restaurant
    const menuItems = await MenuItem.find({ restaurant: id })
      .select('name description price category image isVegetarian ratings');

    // Group menu items by category
    const menuByCategory = {};
    menuItems.forEach(item => {
      if (!menuByCategory[item.category]) {
        menuByCategory[item.category] = [];
      }
      menuByCategory[item.category].push(item);
    });

    res.json({
      restaurant,
      menu: menuByCategory,
      isOpen: restaurant.isOpenNow()
    });
  } catch (error) {
    console.error('Get restaurant by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant Owner)
const createRestaurant = async (req, res) => {
  try {
    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user._id });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'You already have a registered restaurant' });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      ...req.body,
      owner: req.user._id
    });

    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Restaurant Owner)
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Restaurant Owner)
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Soft delete by setting isActive to false
    restaurant.isActive = false;
    await restaurant.save();

    res.json({ message: 'Restaurant deactivated' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Bulk upload menu items
// @route   POST /api/restaurants/:id/menu/bulk
// @access  Private (Restaurant Owner)
const bulkUploadMenuItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuItems } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prepare items with restaurant ID
    const itemsToInsert = menuItems.map(item => ({
      ...item,
      restaurant: id
    }));

    // Bulk insert
    const insertedItems = await MenuItem.insertMany(itemsToInsert);

    // Update restaurant's featured items if specified
    if (req.body.updateFeaturedItems) {
      restaurant.featuredItems = insertedItems
        .filter(item => item.ratings.average >= 4)
        .slice(0, 5)
        .map(item => item._id);
      await restaurant.save();
    }

    res.status(201).json(insertedItems);
  } catch (error) {
    console.error('Bulk upload menu items error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  bulkUploadMenuItems
}; 