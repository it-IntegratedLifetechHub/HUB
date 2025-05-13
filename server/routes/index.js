const express = require("express");
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const Admin = require("../Models/Admin");
const jwt = require("jsonwebtoken");

const {
  registerValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const { register, login } = require("../Controllers/AuthController");
const ensureAuthenticated = require("../Middlewares/Auth");

const Patient = require("../Models/Patient");
const Category = require("../Models/Category");
const Order = require("../Models/Order");

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

// Validation middleware
const validateBooking = [
  body("testDetails").exists().withMessage("Test details are required"),
  body("testDetails.name").notEmpty().withMessage("Test name is required"),
  body("testDetails.categoryId")
    .notEmpty()
    .withMessage("Category ID is required"),
  body("testDetails.totalCost")
    .isNumeric()
    .withMessage("Total cost must be a number")
    .custom((value) => value > 0)
    .withMessage("Total cost must be positive"),

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Name too long"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("phone").trim().isMobilePhone().withMessage("Invalid phone number"),
  body("gender")
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Invalid gender selection"),

  body("preferredDate")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    })
    .withMessage("Date must be today or in the future"),
  body("preferredTime").notEmpty().withMessage("Time slot is required"),

  body("street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required")
    .isLength({ max: 200 })
    .withMessage("Address too long"),
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 50 })
    .withMessage("City name too long"),
  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ max: 50 })
    .withMessage("State name too long"),
  body("zip")
    .trim()
    .notEmpty()
    .withMessage("ZIP code is required")
    .isPostalCode("any")
    .withMessage("Invalid ZIP code"),
  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ max: 50 })
    .withMessage("Country name too long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.param.includes(".") ? err.param.split(".")[1] : err.param,
          message: err.msg,
        })),
      });
    }
    next();
  },
];
router.post("/api/orders", validateBooking, async (req, res) => {
  try {
    const {
      testDetails,
      fullName,
      email,
      phone,
      gender,
      preferredDate,
      preferredTime,
      notes,
      street,
      city,
      state,
      zip,
      country,
      paymentMethod,
      userId,
    } = req.body;

    // Validate required fields
    if (!testDetails?.name || !testDetails?.categoryId) {
      return res.status(400).json({
        success: false,
        message: "Test name and category ID are required",
      });
    }
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Valid payment method (cod/online) is required",
      });
    }

    const order = new Order({
      user: userId,
      test: {
        name: testDetails.name,
        categoryId: testDetails.categoryId,
        totalCost: testDetails.totalCost || 0,
        description: testDetails.description || "",
        preparation: testDetails.preparation || "No special preparation needed",
        turnaroundTime: testDetails.turnaroundTime || "24-48 hours",
        specialist: testDetails.specialist || "General Practitioner",
        whyToTake: testDetails.whyToTake || "",
      },
      patient: {
        fullName,
        email,
        phone,
        gender,
      },
      payment: {
        method: paymentMethod,
        status: "pending",
        amount: testDetails.totalCost || 0, // Ensure amount is set
      },
      appointment: {
        preferredDate: new Date(preferredDate),
        preferredTime,
        notes: notes || undefined,
      },
      address: {
        street,
        city,
        state,
        zip,
        country,
      },
      status: "pending",
    });

    const savedOrder = await order.save();

    // Return the order with both _id and id fields
    const responseData = {
      ...savedOrder.toObject(),
      id: savedOrder._id.toString(), // Ensure id field is included
    };

    res.status(201).json({
      success: true,
      data: responseData,
      message: "Booking confirmed successfully!",
    });
  } catch (err) {
    console.error("Error creating order:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Order number conflict, please try again",
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create booking. Please try again.",
    });
  }
});

router.get("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email phone")
      .populate("test.categoryId", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Process payment
router.post("/api/orders/:orderId/pay", async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.payment?.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // Update payment status
    order.payment = {
      method: paymentMethod,
      status: "completed",
      amount: order.test.totalCost,
      completedAt: new Date(),
      transactionId: uuidv4(),
      details: paymentDetails, // storing payment details inside a subfield for clarity
    };

    order.status = "confirmed";

    const savedOrder = await order.save();

    return res.status(200).json({
      success: true,
      data: {
        orderId: savedOrder._id,
        paymentId: savedOrder.payment.transactionId,
        amount: savedOrder.payment.amount,
        status: savedOrder.status,
      },
    });
  } catch (err) {
    console.error("Payment error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment processing failed",
    });
  }
});

// Get all orders for a specific user
router.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("test.categoryId", "name")
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    // Format the orders for the frontend
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      status: order.status,
      createdAt: order.createdAt,
      completedAt: order.payment?.completedAt,
      test: {
        name: order.test.name,
        preparation: order.test.preparation,
        turnaroundTime: order.test.turnaroundTime,
        specialist: order.test.specialist,
        whyToTake: order.test.whyToTake,
      },
      appointment: {
        preferredDate: order.appointment.preferredDate,
        preferredTime: order.appointment.preferredTime,
        collectionType: order.appointment.collectionType || "Lab Visit",
        notes: order.appointment.notes,
      },
      payment: {
        method: order.payment.method,
        status: order.payment.status,
        amount: order.payment.amount,
      },
      reportUrl: order.reportUrl,
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

// ~~~~~~  HUB routes  ~~~~~~~~
router.get("/api/patients/total", async (req, res) => {
  try {
    const total = await Patient.countDocuments();
    res.status(200).json({ totalPatients: total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total patients" });
  }
});

// Register Admin
router.post(
  "/api/hub/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if admin exists
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({ msg: "Admin already exists" });
      }

      admin = new Admin({ email, password });
      await admin.save();

      // Create JWT
      const payload = { admin: { id: admin.id } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login Admin
router.post(
  "/api/hub/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if admin exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Check password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Create JWT
      const payload = { admin: { id: admin.id } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
