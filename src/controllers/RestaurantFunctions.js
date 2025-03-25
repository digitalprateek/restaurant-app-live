const Restaurant = require("../models/Restaurant");
const bcrypt = require('bcrypt');

//was thinking to create a new admin login account so i could use this function for both but now it's not needed. However, I'm still using it in the restaurant routes


const UpdateRestaurant = async(req, res)=>{
  const {restaurantId} = req.params;
  // console.log(req.body);
  const {edits}= req.body;
  // console.log(edits);
  // console.log("reached", restaurantId);
    // const {name, desc, location,rating, img} = req.body;
    // const hashedPassword = await bcrypt.hash(password, 12);
    // const restaurant = await Restaurant.create({name, desc, rating, img, location, password: hashedPassword});
    await Restaurant.findByIdAndUpdate(restaurantId, edits);
    res.status(200).json({"message":"Restaurant is updated successfully"});
  }

  module.exports = {
    UpdateRestaurant
  }