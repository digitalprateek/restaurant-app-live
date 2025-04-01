const express = require("express");
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const catchAsync = require('../core/catchAsync')
const { BadRequestError, AuthenticationError } = require("../core/ApiError");
const {jwtAdminKey} = require('../configs/jwtConfig');
const {UpdateRestaurant} = require('../controllers/RestaurantFunctions')
const bcrypt = require('bcrypt');
const { isValidObjectId } = require('mongoose'); // Make sure to import this
const jwt = require('jsonwebtoken')
const {isAdminLoggedIn} = require('../middlewares/AuthMiddlewares');
// const isAdminLoggedIn = AuthMiddlewares.isAdminLoggedIn;

//add a restaurant listing
router.post("/",catchAsync(async(req, res) => {
  // console.log(req.body);
  // console.log("creating the Restaurant");
  const {name, desc, rating, img, location, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
  // const restaurant = new Restaurant({name, desc, rating, img});
  // await restaurant.save(); // this was how to save data but can be done a little more in a simple way bellow
  const restaurant = await Restaurant.create({name, desc, rating, img, location, password: hashedPassword});
  // console.log(restaurant);
  // console.log("Restaurant has been created successfully");
  res.status(200).json({
    "message": "Restaurant has been registered, thanks.",
    "id": restaurant._id
  });
}));

//get all retaurants
router.get("/", catchAsync(async (req, res) => {
  // try {
    // throw new Error('Some error occurred');
     try {
    const restaurants = await Restaurant.find().populate('foods').select('-password'); // Exclude the password field
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }// Send the response with the restaurants data
  // }
  //  catch (err) {
  //   console.error('Error fetching restaurants:', err); // Log the error for debugging
  //   res.status(500).json({ message: 'Request failed to find restaurants. Please check your network or try again later' }); // Send an error response
  // }
}));

// const isValidObjectId = (id) => {
//   return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
// };

//get a restaurant by id
router.get('/single/:restaurantId', catchAsync(async (req, res) => {
    const { restaurantId } = req.params; // Shorthand destructure for object
      // console.log("inside var");
    // Validate the restaurant ID
    if (!isValidObjectId(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    // Fetching the restaurant by ID, excluding the password
    //in select we can tell what data we want and what not I could use this also const restaurant = await Restaurant.findById(restaurantId).select('name img desc rating location foods'); if i would want to remove multile things but it's fine for now 
    const restaurant = await Restaurant.findById(restaurantId).select('-password');

    // Check if the restaurant exists
    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Sending all about restaurant except password
    // const restDetails = {
    //     name: restaurant.name,
    //     img: restaurant.img,
    //     desc: restaurant.desc,
    //     rating: restaurant.rating,
    //     location: restaurant.location,
    //     foods: restaurant.foods
    // };

    res.status(200).json(restaurant);
}));

//update a restaurant with patch request because only some changes when reuire complete change then put request
router.patch('/:restaurantId', catchAsync(UpdateRestaurant));


// delete a restaurant by id with error handlings and response status errors
router.delete('/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant has been deleted successfully" });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: "An error occurred while deleting the restaurant" });
  }
});

router.post('/admin-login', catchAsync(async(req, res) => {
  const { restaurantId, restaurantName, password } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new AuthenticationError("Couldn't find the restaurant with this id");
  }
  if (restaurantName !== restaurant.name) {
    throw new AuthenticationError(`Couldn't find any restaurant with this name: ${restaurantName}`);
  }
  const isValidPassword = await bcrypt.compare(password, restaurant.password);
  if (!isValidPassword) {
    throw new AuthenticationError("Invalid details");
  }
  const AdminToken = jwt.sign({restaurantId: restaurant.id}, jwtAdminKey);
  res.cookie('AdminToken', AdminToken, {
    httpOnly: true, //true when live
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Admin logged in Successfully" });
}));


// catchAsync(isAdminLoggedIn), add it later in fetchdetails
router.get('/admin-profile', catchAsync(isAdminLoggedIn), catchAsync(async (req, res) => {
  // console.log("inside profile router");
  const { restaurantId } = req; // Now available because of the middleware
  // console.log("restaurant id : ", restaurantId);
  const restAdmin = await Restaurant.findById(restaurantId).select('-password').populate('foods');
  if (!restAdmin) {
    throw new AuthenticationError("Error finding the restaurant");
  }
  res.status(200).json(restAdmin);
}));

router.post('/logout', catchAsync(isAdminLoggedIn), async(req, res)=>{
  res.cookie('AdminToken', '',
    { httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1
     });
  res.status(200).json({message: "Admin logged out successfully"});
});

module.exports = router;
