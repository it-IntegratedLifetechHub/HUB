const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    // Test Information
    test: {
      name: { type: String, required: [true, "Test name is required"] },
      categoryId: {
        type: Schema.Types.ObjectId,
        required: [true, "Category ID is required"],
        ref: "Category", // Assuming this references a Category model
      },
      totalCost: {
        type: Number,
        required: [true, "Total cost is required"],
        min: [0, "Total cost cannot be negative"],
      },
      description: String,
      preparation: String,
      turnaroundTime: String,
      specialist: String,
      whyToTake: String,
    },

    // Patient Information
    patient: {
      fullName: { type: String, required: [true, "Full name is required"] },
      email: {
        type: String,
        required: [true, "Email is required"],
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
      gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: {
          values: ["male", "female", "other", "prefer-not-to-say"],
          message: "{VALUE} is not a valid gender",
        },
      },
    },
    payment: {
      type: String,
      enum: {
        values: ["pending", "COD", "completed", "cancelled"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },

    // Appointment Details
    appointment: {
      preferredDate: {
        type: Date,
        required: [true, "Preferred date is required"],
        min: [Date.now, "Preferred date cannot be in the past"],
      },
      preferredTime: {
        type: String,
        required: [true, "Preferred time is required"],
      },
      notes: String,
    },

    // Address Information
    address: {
      street: { type: String, required: [true, "Street address is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      zip: { type: String, required: [true, "ZIP code is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },

    // System Information
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "completed", "cancelled"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true, // This automatically handles createdAt and updatedAt
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.isNew || this.orderNumber) {
    return next();
  }

  try {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now().toString().slice(-6)}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
