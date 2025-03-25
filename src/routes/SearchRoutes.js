const express = require('express');
const router = express.Router();
const Fuse = require('fuse.js');

const Restaurant = require('../models/Restaurant'); // Adjust the path as needed
const Food = require('../models/Food'); // Adjust the path as needed

// GET /api/v1/search?mode=delivery&query=searchTerm
router.get('/', async (req, res) => {
  const { mode, query } = req.query;
    // console.log(mode, query);
  if (!mode || !query) {
    return res.status(400).json({ error: 'Both mode and search query (query) are required.' });
  }

  // Trim query to avoid issues with extra whitespace
  const searchQuery = query.trim();

  try {
    if (mode.toLowerCase() === 'delivery') {
      // Initial regex search for restaurants (by name or location)
      let restaurants = await Restaurant.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { location: { $regex: searchQuery, $options: 'i' } }
        ]
      });
      
      // Initial regex search for foods (by name)
      let foods = await Food.find({
        $or: [
       { name: { $regex: searchQuery, $options: 'i' }}
        ]
      });
      // console.log("food coming from regex", foods);
      
      // If no restaurants found, perform fuzzy search on all restaurants.
      if (restaurants.length === 0) {
        const allRestaurants = await Restaurant.find();
        const fuseOptions = { keys: ['name', 'location'], threshold: 0.3 };
        const fuse = new Fuse(allRestaurants, fuseOptions);
        const fuzzyResults = fuse.search(searchQuery);
        restaurants = fuzzyResults.map(result => result.item);
        // console.log("rest coming from fuzz", allRestaurants);
      }

      // If no foods found, perform fuzzy search on all food items.
      if (foods.length === 0) {
        const allFoods = await Food.find();
        const fuseOptions = { keys: ['name'], threshold: 0.3 };
        const fuse = new Fuse(allFoods, fuseOptions);
        const fuzzyResults = fuse.search(searchQuery);
        foods = fuzzyResults.map(result => result.item);
        // console.log("food coming from fuzz", foods);
      }

      // If both restaurants and foods are empty after fuzzy search, return a not found message.
      if (restaurants.length === 0 && foods.length === 0) {
        return res.status(404).json({ message: `No restaurant or food item found with the search: "${searchQuery}".` });
      }
      return res.status(200).json({ restaurants, foods });
    } 
    else if (mode.toLowerCase() === 'dinein') {
      // Initial regex search for restaurants by location.
      let restaurants = await Restaurant.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { location: { $regex: searchQuery, $options: 'i' } }
        ]
      });

      // If no restaurants found, perform fuzzy search. 
      // Here we search both 'location' and 'name' so that if the location field alone doesn’t match,
      // a restaurant with a name containing the query might still be returned.
      if (restaurants.length === 0) {
        const allRestaurants = await Restaurant.find();
        const fuseOptions = { keys: ['location', 'name'], threshold: 0.3 };
        const fuse = new Fuse(allRestaurants, fuseOptions);
        const fuzzyResults = fuse.search(searchQuery);
        restaurants = fuzzyResults.map(result => result.item);
      }

      // If still empty, return a not found message.
      if (restaurants.length === 0) {
        return res.status(404).json({ message: `No restaurant found with search: "${searchQuery}".` });
      }

      return res.status(200).json({ restaurants });
    } else {
      return res.status(400).json({ error: 'Invalid mode. Go to "delivery" or "dinein".' });
    }
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
