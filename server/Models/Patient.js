const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: [true, "Patient name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [/^\+?[\d\s\-]+$/, "Please enter a valid phone number"],
  },

  // Personal Information (optional)
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
  },
  dob: Date,
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed", "Separated"],
  },
  height: String,
  weight: String,
  location: String,

  // Emergency Contact (optional)
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },

  // Medical Information (optional)
  allergies: [String],
  currentMedications: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  pastMedications: [
    {
      name: String,
      year: Number,
      reason: String,
    },
  ],
  injuries: [
    {
      description: String,
      year: Number,
    },
  ],
  surgeries: [
    {
      name: String,
      year: Number,
    },
  ],
  chronicConditions: [String],
  familyHistory: [String],

  // Lifestyle Information (optional)
  smokingHabits: {
    type: String,
    enum: ["Non-smoker", "Former smoker", "Current smoker"],
  },
  alcoholConsumption: {
    type: String,
    enum: ["Non-drinker", "Occasional", "Regular"],
  },
  activityLevel: {
    type: String,
    enum: [
      "Sedentary",
      "Lightly active",
      "Moderately active",
      "Very active",
      "Extremely active",
    ],
  },
  foodPreference: {
    type: String,
    enum: ["Vegetarian", "Vegan", "Non-vegetarian", "Pescatarian", "Other"],
  },
  occupation: String,
  sleepPattern: String,
  stressLevel: {
    type: String,
    enum: ["Low", "Moderate", "High"],
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
PatientSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
