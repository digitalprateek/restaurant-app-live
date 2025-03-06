const jwt = require("jsonwebtoken");
const { jwtSecretKey, jwtAdminKey } = require("../configs/jwtConfig");
const { BadRequestError } = require("../core/ApiError");

const isLoggedIn = async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new BadRequestError("Please login to continue");
    }
    try {
        const { userId } = jwt.verify(token, jwtSecretKey);  // Match with the login JWT payload
        req.userId = userId;
        return next();
    } catch (error) {
        throw new BadRequestError("Invalid token request");
    }
};

const isAdminLoggedIn = async (req, res, next) => {
    const { AdminToken } = req.cookies;
    if (!AdminToken) {
        throw new BadRequestError("Please login to continue");
    }
    try {
        const { restaurantId } = jwt.verify(AdminToken, jwtAdminKey);  // Match with the login JWT payload
        req.restaurantId = restaurantId;
        return next();
    } catch (error) {
        throw new BadRequestError("Invalid token request");
    }
  };

module.exports = {isLoggedIn, isAdminLoggedIn};

// module.exports.isLoggedIn = isLoggedIn;
// module.exports.isAdminLoggedIn = isAdminLoggedIn;


// const { AdminToken } = req.cookies;
//     if (!AdminToken) {
//         // console.log("no token");
//         return res.status(401).json({ error: "Please login to continue" });
//     }
//     try {
//         // console.log("Verifying token");
//         const decoded = jwt.verify(AdminToken, jwtAdminKey);
//         // console.log("Decoded token:", decoded);
//         const { restaurantId } = decoded;
//         req.restaurantId = restaurantId;
//         return next();
//     } catch (error) {
//         // console.error("Token verification error:", error);
//         if(error.name == "TokenExpiredError"){
//           return res.status(401).json({ error: "Token expired" });
//         }
//         return res.status(401).json({ error: "Invalid token request" });
//     }