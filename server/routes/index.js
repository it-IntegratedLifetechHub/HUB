const express = require("express");
const router = express.Router();
const Patient = require("../Models/Patient");
const createError = require("http-errors");

// Patient Registration with OTP
router.post("/api/patients/register", async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    // Input validation
    if (!name || !phone) {
      throw createError(400, "Name and phone number are required");
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      throw createError(400, "Phone number must be 10 digits");
    }

    // Trim and format name
    const formattedName = name.trim();

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      throw createError(400, "Phone number already registered");
    }

    // In a real app, you would send an OTP here
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      staticOTP: "123456", // For demo purposes only
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      error = createError(400, "Phone number already registered");
    }
    next(error);
  }
});

// Verify Registration OTP
router.post("/api/patients/verify-registration", async (req, res, next) => {
  try {
    const { name, phone, otp } = req.body;

    // Input validation
    if (!name || !phone || !otp) {
      throw createError(400, "All fields are required");
    }

    // Static OTP verification
    if (otp !== "123456") {
      throw createError(400, "Invalid OTP");
    }

    // Check if patient already exists (double check)
    const existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      throw createError(400, "Phone number already registered");
    }

    // Create new patient
    const patient = new Patient({
      name: name.trim(),
      phone,
    });

    const savedPatient = await patient.save();

    return res.status(201).json({
      success: true,
      data: {
        id: savedPatient._id,
        name: savedPatient.name,
        phone: savedPatient.phone,
        createdAt: savedPatient.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});


// Patient Login with OTP
router.post("/api/patients/login", async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Input validation
    if (!phone) {
      throw createError(400, "Phone number is required");
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      throw createError(400, "Phone number must be 10 digits");
    }

    // Check if patient exists
    const patient = await Patient.findOne({ phone });
    if (!patient) {
      throw createError(404, "Patient not found. Please register first.");
    }

    // In a real app, you would send an OTP here
    // For demo, we'll return a static OTP
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      staticOTP: "123456", // For demo purposes only
    });
  } catch (error) {
    next(error);
  }
});

// Verify Login OTP
router.post("/api/patients/verify-login", async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    // Input validation
    if (!phone || !otp) {
      throw createError(400, "Phone number and OTP are required");
    }

    // Static OTP verification for demo
    if (otp !== "123456") {
      throw createError(400, "Invalid OTP");
    }

    // Check if patient exists
    const patient = await Patient.findOne({ phone });
    if (!patient) {
      throw createError(404, "Patient not found");
    }

    return res.status(200).json({
      success: true,
      data: {
        id: patient._id,
        name: patient.name,
        phone: patient.phone,
        createdAt: patient.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
