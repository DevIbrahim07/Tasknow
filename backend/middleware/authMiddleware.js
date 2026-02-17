const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach user to request
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized , token failed",
      });
    }
  }

  return res.status(401).json({
    message: " Not authorized , no token",
  });
};

module.exports = authMiddleware;
