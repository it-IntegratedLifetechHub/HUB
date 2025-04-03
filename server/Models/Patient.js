const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
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
  },
});

// Removed duplicate index definition
// The unique: true above already creates the index

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
