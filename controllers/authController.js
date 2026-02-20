const Employee = require("../models/Employee");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
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

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const existingEmail = await Employee.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        id: newEmployee.id,
        displayId: `IN${newEmployee.id}`
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


/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    let { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "ID and Password are required"
      });
    }

    id = id.toUpperCase();

    const numericId = id.replace(/[^0-9]/g, "");

    if (!numericId) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    /* ===== ADMIN LOGIN ===== */
    if (id.startsWith("ADM")) {

      const admin = await Admin.findByPk(numericId);

      if (!admin) {
        return res.status(400).json({
          success: false,
          message: "Admin not found"
        });
      }

      if (admin.password !== password) {
        return res.status(400).json({
          success: false,
          message: "Invalid Admin Password"
        });
      }

      return res.json({
        success: true,
        role: "admin",
        data: {
          id: admin.id,
          displayId: `ADM${admin.id}`
        }
      });
    }

    /* ===== EMPLOYEE LOGIN ===== */
    if (id.startsWith("IN")) {

      const employee = await Employee.findByPk(numericId);

      if (!employee) {
        return res.status(400).json({
          success: false,
          message: "Employee not found"
        });
      }

      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid Employee Password"
        });
      }

      return res.json({
        success: true,
        role: "employee",
        data: {
          id: employee.id,
          displayId: `IN${employee.id}`,
          name: employee.name,
          email: employee.email
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: "ID must start with ADM or IN"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};