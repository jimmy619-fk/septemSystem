const { verifyToken } = require("../utils/authUtils");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.userId = decoded.id;
  req.userRole = decoded.role;
  next();
};

module.exports = authenticateUser;
