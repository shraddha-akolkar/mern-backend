const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function(value) {
        const age = (Date.now() - value.getTime()) / (1000 * 60 * 60 * 24 * 365);
        return age >= 18 && age <= 100;
      },
      message: "Employee must be between 18 and 100 years old"
    }
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    minlength: [10, "Address must be at least 10 characters long"],
    maxlength: [500, "Address cannot exceed 500 characters"]
  },
  zipCode: {
    type: String,
    required: [true, "Zip code is required"],
    match: [/^[0-9]{5,6}$/, "Please enter a valid 5-6 digit zip code"]
  },
  type: {
    type: String,
    required: [true, "Type is required"],
    enum: {
      values: ["Full-time", "Part-time", "Contract", "Intern"],
      message: "Type must be Full-time, Part-time, Contract, or Intern"
    }
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    trim: true
  },
  visaStatus: {
    type: String,
    required: [true, "Visa status is required"],
    enum: {
      values: ["Citizen", "Green Card", "H1B", "L1", "OPT", "Other"],
      message: "Invalid visa status"
    }
  },
  visaExpiringOn: {
    type: Date,
    required: function() {
      return this.visaStatus !== "Citizen";
    },
    validate: {
      validator: function(value) {
        if (this.visaStatus === "Citizen") return true;
        return value > Date.now();
      },
      message: "Visa expiry date must be in the future"
    }
  },
  idProof: {
    type: String,
    required: [true, "ID proof is required"]
  },
  employeePicture: {
    type: String,
    required: [true, "Employee picture is required"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);