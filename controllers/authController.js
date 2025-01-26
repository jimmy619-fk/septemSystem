const User = require("../models/User");
const { generateToken } = require("../utils/authUtils");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate the role
    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role provided",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = { register, login };
