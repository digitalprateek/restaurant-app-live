// (function(){})() -- IIFE = imidiate invoke function expression
// the IIFE is a function that is invoked immediately after it is defined. It is a way to create a scope for the code inside it, so that it does not pollute the global scope.

// the parameters passed in the link are always the string. So we need to convert them to the number when required.

// import express from 'express'; or

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');



// midle layer to convert my data and pass it in json format in objects
app.use(express.json());
app.use(express.urlencoded({extended: true})); //to submit data through form and pass it as json
app.use(cors({
    origin: ['https://restaurant.websetgram.com'],
    // origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE','PATCH'],
    credentials: true
}));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //max 8 req in 10 mins
  max: 8,
  message: { error: "Too many login attempts. Please try again later." },
});

app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/restaurants/admin-login', authLimiter);

// Apply the rate limiter to all requests
app.use(limiter);

// import all Routes here
const RestaurantsRoute = require("./routes/RestaurantsRoutes");
const AuthRoutes = require('./routes/AuthRoutes');
const FoodRoutes = require('./routes/FoodRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const searchRoutes = require('./routes/SearchRoutes');
const uploadRoute = require('./routes/UploadRoutes');
const ContactRoutes = require('./routes/ContactRoutes');

// there are many methods in app object. We can use them to create routes and handle requests.
// app.get() - to handle get requests
// app.post() - to handle post requests
// const port = 8080;

// app.use((port, res) => {
//     console.log("Inside app.use");
//     res.send("app started")
// });

// mount the routes in this app.js
app.use('/api/v1/restaurants', RestaurantsRoute);
app.use('/api/v1/users', AuthRoutes);
app.use('/api/v1/order', OrderRoutes);
app.use('/api/v1/:restaurantId/foods', FoodRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/upload', uploadRoute);
app.use('/api/v1/contact', ContactRoutes);

// app.get('/hello', (req, res) => {
//     console.log(req.query);
//     res.send("Received Hello Request");
// });


// app.listen(port, ()=>{
//     console.log(`server is running on ${port}`);
// });

//error handler for all errors by express
app.use((err, req, res, next) => {
    const { status = 500, message = 'Internal server error' } = err;
    res.status(status).json({ error: message });
  });


module.exports = app; 
// or export default app this is es6 syntax. Both are same.
