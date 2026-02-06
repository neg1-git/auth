const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // 1. Get the token from the header
    const jwtToken = req.header("token");

    // 2. Check if there is no token
    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    // 3. Verify the token (Check the signature)
    // If valid, it returns the payload: { user: 1 }
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    // 4. Attach the user_id to the request so we can use it later
    req.user = payload.user;

    // 5. Continue to the actual route
    next();

  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorized");
  }
};