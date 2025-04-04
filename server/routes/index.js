const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const { register, login } = require("../Controllers/AuthController");
const ensureAuthenticated = require("../Middlewares/Auth");

const Patient = require("../Models/Patient");

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);

router.get("/protected", ensureAuthenticated, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});
// Enhanced GET patient profile endpoint
router.get("/api/patient/me", ensureAuthenticated, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id)
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Ensure nested objects exist
    const responseData = {
      ...patient,
      emergencyContact: patient.emergencyContact || {
        name: "",
        phone: "",
        relation: "",
      },
      currentMedications: patient.currentMedications || [],
      pastMedications: patient.pastMedications || [],
      injuries: patient.injuries || [],
      surgeries: patient.surgeries || [],
      allergies: patient.allergies || [],
      chronicConditions: patient.chronicConditions || [],
      familyHistory: patient.familyHistory || [],
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// Enhanced PUT patient profile endpoint
router.put("/api/patient/me", ensureAuthenticated, async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      gender,
      dob,
      bloodGroup,
      maritalStatus,
      height,
      weight,
      location,
      emergencyContact,
      allergies,
      currentMedications,
      pastMedications,
      injuries,
      surgeries,
      chronicConditions,
      familyHistory,
      smokingHabits,
      alcoholConsumption,
      activityLevel,
      foodPreference,
      occupation,
      sleepPattern,
      stressLevel,
    } = req.body;

    // Construct update object
    const updates = {
      name,
      phone,
      email,
      gender,
      dob: dob ? new Date(dob) : null,
      bloodGroup,
      maritalStatus,
      height,
      weight,
      location,
      emergencyContact,
      allergies: allergies || [],
      currentMedications: currentMedications || [],
      pastMedications: pastMedications || [],
      injuries: injuries || [],
      surgeries: surgeries || [],
      chronicConditions: chronicConditions || [],
      familyHistory: familyHistory || [],
      smokingHabits,
      alcoholConsumption,
      activityLevel,
      foodPreference,
      occupation,
      sleepPattern,
      stressLevel,
    };

    // Clean undefined values
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-__v -createdAt -updatedAt",
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: patient,
    });
  } catch (err) {
    console.error("Profile update error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
