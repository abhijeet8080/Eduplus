const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  console.log("Authenticate is called")
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  console.log(req.user)
  console.log("Authorize is called and role is ", req.user.role)
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "Access denied" });
  next();
};
