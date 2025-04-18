const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  registerValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const { register, login } = require("../Controllers/AuthController");
const ensureAuthenticated = require("../Middlewares/Auth");

const Patient = require("../Models/Patient");
const Category = require("../Models/Category");

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);

router.get("/protected", ensureAuthenticated, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});
// Logout route
router.post("/api/logout", ensureAuthenticated, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
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

// Enhanced GET endpoint with pagination and search
router.get("/api/categories", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const [categories, total] = await Promise.all([
      Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Category.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: categories,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Create a new category
router.post(
  "/api/categories",
  [
    check("name", "Category name is required").not().isEmpty(),
    check("icon", "Category icon is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, icon } = req.body;

      // Check if category exists
      let category = await Category.findOne({ name });
      if (category) {
        return res.status(400).json({ msg: "Category already exists" });
      }

      category = new Category({
        name,
        icon,
      });

      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// DELETE category endpoint
router.delete("/api/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
// GET - Get single category by ID
router.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// GET - Get tests for a category
router.get("/api/categories/:categoryId/tests", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category.tests,
    });
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// POST - Add test to category
router.post(
  "/api/categories/:categoryId/tests",
  [
    check("name").notEmpty().withMessage("Test name is required").trim(),
    check("description")
      .notEmpty()
      .withMessage("Description is required")
      .trim(),
    check("turnaroundTime")
      .notEmpty()
      .withMessage("Turnaround time is required"),
    check("totalCost")
      .notEmpty()
      .withMessage("Cost is required")
      .isFloat({ min: 0.01 }),
    check("icon").optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Check for duplicate test name
      const duplicateTest = category.tests.some(
        (test) => test.name.toLowerCase() === req.body.name.toLowerCase()
      );
      if (duplicateTest) {
        return res.status(400).json({
          success: false,
          message: "A test with this name already exists in this category",
        });
      }

      const newTest = {
        ...req.body,
        totalCost: parseFloat(req.body.totalCost),
      };

      category.tests.push(newTest);
      await category.save();

      res.status(201).json({
        success: true,
        data: category.tests[category.tests.length - 1],
      });
    } catch (err) {
      console.error("Error adding test:", err);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
// DELETE - Remove test from category
router.delete("/api/categories/:categoryId/tests/:testId", async (req, res) => {
  try {
    const { categoryId, testId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const testIndex = category.tests.findIndex(
      (test) => test._id.toString() === testId
    );

    if (testIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    category.tests.splice(testIndex, 1);
    await category.save();

    return res.json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
