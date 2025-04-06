const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Test name is required"],
      trim: true,
      maxlength: [100, "Test name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    preparation: {
      type: String,
      trim: true,
      maxlength: [500, "Preparation instructions cannot exceed 500 characters"],
    },
    turnaroundTime: {
      type: String,
      trim: true,
      maxlength: [50, "Turnaround time cannot exceed 50 characters"],
    },
    whyToTake: {
      type: String,
      trim: true,
      maxlength: [500, "Reason for test cannot exceed 500 characters"],
    },
    totalCost: {
      type: Number,
      min: [0, "Cost cannot be negative"],
      set: (v) => Math.round(v * 100) / 100, // Round to 2 decimal places
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      index: true,
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      default: "fas fa-folder",
      maxlength: [50, "Icon cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    tests: [testSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Add compound text index for search
categorySchema.index(
  {
    name: "text",
    description: "text",
    "tests.name": "text",
    "tests.description": "text",
  },
  {
    weights: {
      name: 5,
      "tests.name": 4,
      description: 2,
      "tests.description": 1,
    },
    name: "category_text_search",
  }
);

// Index for frequently queried fields
categorySchema.index({ isActive: 1, isFeatured: 1, displayOrder: 1 });

// Virtual for test count
categorySchema.virtual("testCount").get(function () {
  return this.tests?.length || 0;
});

// Pre-save hook to ensure test names are unique within a category
categorySchema.pre("save", async function (next) {
  if (!this.isModified("tests")) return next();

  const testNames = new Set();
  for (const test of this.tests) {
    if (testNames.has(test.name.toLowerCase())) {
      throw new Error(`Duplicate test name found: ${test.name}`);
    }
    testNames.add(test.name.toLowerCase());
  }

  next();
});

// Query helper for active categories
categorySchema.query.active = function () {
  return this.where({ isActive: true });
};

// Query helper for featured categories
categorySchema.query.featured = function () {
  return this.where({ isFeatured: true, isActive: true });
};

// Static method for case-insensitive name check
categorySchema.statics.nameExists = async function (name) {
  const category = await this.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  return !!category;
};

const Category = mongoose.model("Category", categorySchema);

// Use module.exports instead of export default for CommonJS
module.exports = Category;
