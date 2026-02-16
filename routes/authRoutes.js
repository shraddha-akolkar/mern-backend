const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const { validateLogin, validateRegisterAuth } = require("../middleware/loginValidation");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

// @route   POST /api/auth/register
// @desc    Register employee auth account
// @access  Public
router.post("/register", validateRegisterAuth, async (req, res) => {
  try {
    const { employeeId, password, name, email, role } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ 
      $or: [
        { employeeId: employeeId.toUpperCase() }, 
        { email: email.toLowerCase() }
      ] 
    });

    if (existingEmployee) {
      if (existingEmployee.employeeId === employeeId.toUpperCase()) {
        return res.status(400).json({
          success: false,
          errors: [{ field: "employeeId", message: "Employee ID already exists" }]
        });
      }
      if (existingEmployee.email === email.toLowerCase()) {
        return res.status(400).json({
          success: false,
          errors: [{ field: "email", message: "Email already registered" }]
        });
      }
    }

    // Create employee auth account
    const employee = await Employee.create({
      employeeId: employeeId.toUpperCase(),
      password,
      name,
      email: email.toLowerCase(),
      role: role || "employee"
    });

    res.status(201).json({
      success: true,
      message: "Employee auth account created successfully",
      data: {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        success: false,
        errors 
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        errors: [{ 
          field: field, 
          message: `${field === 'employeeId' ? 'Employee ID' : 'Email'} already exists` 
        }]
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
});

// @route   POST /api/auth/login

// @desc    Login employee
// @access  Public
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId: employeeId.toUpperCase() });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid employee ID or password"
      });
    }

    // Check if employee is active
    if (!employee.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact HR."
      });
    }

    // Check password
    const isPasswordCorrect = await employee.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid employee ID or password"
      });
    }

    // Update last login
    employee.lastLogin = Date.now();
    await employee.save();

    // Generate token
    const token = generateToken(employee._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in employee
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout employee
// @access  Private
router.post("/logout", protect, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;