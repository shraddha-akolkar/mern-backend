const { body, validationResult } = require("express-validator");

const validateEmployee = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2-100 characters"),
  
  body("mobile")
    .trim()
    .notEmpty().withMessage("Mobile number is required")
    .matches(/^[0-9]{10}$/).withMessage("Mobile must be a valid 10-digit number"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  
  body("dob")
    .notEmpty().withMessage("Date of birth is required")
    .isISO8601().withMessage("Invalid date format")
    .custom((value) => {
      const age = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (age < 18 || age > 100) {
        throw new Error("Employee must be between 18 and 100 years old");
      }
      return true;
    }),
  
  body("address")
    .trim()
    .notEmpty().withMessage("Address is required")
    .isLength({ min: 10, max: 500 }).withMessage("Address must be between 10-500 characters"),
  
  body("zipCode")
    .trim()
    .notEmpty().withMessage("Zip code is required")
    .matches(/^[0-9]{5,6}$/).withMessage("Zip code must be 5-6 digits"),
  
  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["Full-time", "Part-time", "Contract", "Intern"]).withMessage("Invalid type"),
  
  body("designation")
    .trim()
    .notEmpty().withMessage("Designation is required"),
  
  body("visaStatus")
    .notEmpty().withMessage("Visa status is required")
    .isIn(["Citizen", "Green Card", "H1B", "L1", "OPT", "Other"]).withMessage("Invalid visa status"),
  
  body("visaExpiringOn")
    .if(body("visaStatus").not().equals("Citizen"))
    .notEmpty().withMessage("Visa expiry date is required for non-citizens")
    .isISO8601().withMessage("Invalid date format")
    .custom((value) => {
      if (new Date(value) <= Date.now()) {
        throw new Error("Visa expiry date must be in the future");
      }
      return true;
    }),
  
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

module.exports = { validateEmployee };