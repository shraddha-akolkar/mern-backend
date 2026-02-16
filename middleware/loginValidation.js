const { body, validationResult } = require("express-validator");

const validateLogin = [
  body("employeeId")
    .trim()
    .notEmpty().withMessage("Employee ID is required")
    .matches(/^[A-Z0-9]{4,10}$/i).withMessage("Invalid Employee ID format")
    .toUpperCase(),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

const validateRegisterAuth = [
  body("employeeId")
    .trim()
    .notEmpty().withMessage("Employee ID is required")
    .matches(/^[A-Z0-9]{4,10}$/i).withMessage("Employee ID must be 4-10 alphanumeric characters")
    .toUpperCase(),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/(?=.*[a-z])/).withMessage("Password must contain at least one lowercase letter")
    .matches(/(?=.*[A-Z])/).withMessage("Password must contain at least one uppercase letter")
    .matches(/(?=.*\d)/).withMessage("Password must contain at least one number"),
  
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

module.exports = { validateLogin, validateRegisterAuth };