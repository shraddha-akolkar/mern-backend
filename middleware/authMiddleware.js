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

    // ✅ Get file names
    const idProof = req.files?.idProof
      ? req.files.idProof[0].filename
      : null;

    const employeePicture = req.files?.employeePicture
      ? req.files.employeePicture[0].filename
      : null;

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
      idProof,
      employeePicture
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