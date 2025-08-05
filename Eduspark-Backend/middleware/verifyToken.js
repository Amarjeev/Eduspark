// Import the jsonwebtoken library to handle JWT operations
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");

// Load environment variables from .env file
require("dotenv").config();

// Retrieve the JWT secret key from environment variables
const jwt_key = process.env.jwt_key;

/**
 * Middleware function to verify the JWT token from cookies.
 * Checks if the token exists and is valid.
 * If valid, attaches decoded user info to the request object and calls next().
 * If invalid or missing, responds with 401 Unauthorized status.
 */
function verifySuperadminToken(req, res, next) {
  // Extract the token named 'superadmin_token' from the cookies
  const token = req.cookies.superadmin_token;

  // If token is not present, respond with Unauthorized status
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, jwt_key);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails (token invalid or expired), respond with Unauthorized status
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
}

//client otp validation

// Export the verifyToken middleware to be used in routes
module.exports = { verifySuperadminToken };
