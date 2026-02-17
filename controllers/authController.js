const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const errors = [];

    const {
      name,
      mobile,
      email,
      dob,
      address,
      zipCode,
      type,
      designation,
      visaStatus,
      visaExpiringOn,
      password
    } = req.body;

    // 🔹 VALIDATION

    if (!name)
      errors.push({ field: "name", message: "Name is required" });

    if (!email) {
      errors.push({ field: "email", message: "Email is required" });
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push({ field: "email", message: "Please enter a valid email address" });
    }

    if (!password) {
      errors.push({ field: "password", message: "Password is required" });
    } else {
      if (password.length < 6)
        errors.push({ field: "password", message: "Password must be at least 6 characters" });
      if (!/[a-z]/.test(password))
        errors.push({ field: "password", message: "Password must contain at least one lowercase letter" });
      if (!/[A-Z]/.test(password))
        errors.push({ field: "password", message: "Password must contain at least one uppercase letter" });
      if (!/[0-9]/.test(password))
        errors.push({ field: "password", message: "Password must contain at least one number" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // 🔹 CHECK EMAIL DUPLICATE

    const existingEmail = await Employee.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        errors: [{ field: "email", message: "Email already exists" }]
      });
    }

    // 🔹 HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 CREATE EMPLOYEE

    const newEmployee = await Employee.create({
      name,
      mobile,
      email,
      dob,
      address,
      zipCode,
      type,
      designation,
      visaStatus,
      visaExpiringOn,
      password: hashedPassword,
      idProof: req.files?.idProof?.[0]?.filename || null,
      employeePicture: req.files?.employeePicture?.[0]?.filename || null
    });

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "ID and Password are required"
      });
    }

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID or Password"
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID or Password"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
