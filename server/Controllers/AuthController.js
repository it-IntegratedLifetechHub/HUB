const Patient = require("../Models/Patient");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Check if user already exists
    const existingUser = await Patient.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    // Create new patient
    const newPatient = new Patient({ name, phone });
    await newPatient.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newPatient._id, phone: newPatient.phone },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: newPatient._id,
        name: newPatient.name,
        phone: newPatient.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};
const login = async (req, res) => {
  try {
    const { phone } = req.body;

    // Find user by phone
    const user = await Patient.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Ensure this is included
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};
module.exports = { register, login };
