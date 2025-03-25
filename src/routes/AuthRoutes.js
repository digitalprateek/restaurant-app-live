//Authentication routes
const express = require('express');
const router = express.Router();
const catchAsync = require('../core/catchAsync');
const {BadRequestError, AuthenticationError} = require('../core/ApiError');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const {jwtSecretKey} = require('../configs/jwtConfig');
const {isLoggedIn} = require('../middlewares/AuthMiddlewares');

router.post('/signup', catchAsync(async(req, res) => {
    const {username, email, phone, password} = req.body;
    const isAlreadyExists = await User.findOne({email});
    if(isAlreadyExists){
        throw new BadRequestError("Email Already Exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({username, email, password: hashedPassword, phone});
    res.status(201).json({message: "Your profile been created successfully"});
}));

router.post('/login', catchAsync(async(req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new AuthenticationError("Invalid email or password ");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        throw new AuthenticationError("Invalid email or password");
    }
    const token = jwt.sign({userId: user.id}, jwtSecretKey);
    // console.log(token);
    //setting the cookie
    res.cookie('token', token, {
        // httpOnly: false, // true when making live
        httpOnly: false, //uncomment and httptrue when live 
        // secure: true, 
        // SameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // Credentials: true
    });
    res.status(200).json({message: "User logged in Successfully"});
}));

router.get('/profile', catchAsync(isLoggedIn), catchAsync(async (req, res) => {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError("User not found");
    }
    res.status(200).json({
        username: user.username,
        email: user.email,    
        phone: user.phone,
        address: user.address,
        alternativePhone: user.alternativePhone,
        userId: userId
    });
}));

router.patch('/:userId', catchAsync(isLoggedIn), catchAsync(async(req,res)=>{
    const {userId} = req.params;
    // console.log(userId);
    const {username, email, phone, address, alternativePhone} = req.body;
    // console.log(alternativePhone, address);
    await User.findByIdAndUpdate(userId, {username, email, phone, address, alternativePhone});
    res.status(200).json({message: "Profile has been updated successfully"});
}));

//logout route
router.post('/logout', catchAsync(isLoggedIn), async(req, res)=>{
    res.cookie('token', '', { httpOnly: true, maxAge: 1 });
    res.status(200).json({message: "User logged out successfully"});
});

module.exports = router;