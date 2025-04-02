const express = require("express");
const router = express.Router();
const Patient = require("../Models/Patient");
const createError = require("http-errors");

// Unified Patient Authentication (Register/Login)
router.post("/api/patients/auth", async (req, res, next) => {
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

    // Check if patient exists
    let patient = await Patient.findOne({ phone });

    if (patient) {
      // Patient exists - login
      return res.status(200).json({
        success: true,
        action: "login",
        data: {
          id: patient._id,
          name: patient.name,
          phone: patient.phone,
          createdAt: patient.createdAt,
        },
      });
    } else {
      // New patient - register
      patient = new Patient({
        name: formattedName,
        phone,
      });

      const savedPatient = await patient.save();

      return res.status(201).json({
        success: true,
        action: "register",
        data: {
          id: savedPatient._id,
          name: savedPatient.name,
          phone: savedPatient.phone,
          createdAt: savedPatient.createdAt,
        },
      });
    }
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      // Duplicate key error (phone number already exists)
      error = createError(400, "Phone number already registered");
    }
    next(error);
  }
});

module.exports = router;
