const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const multer = require("multer");
const path = require("path");

// ✅ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ REGISTER
router.post(
  "/register",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "employeePicture", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const newEmployee = new Employee({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        dob: req.body.dob,
        address: req.body.address,
        zipCode: req.body.zipCode,
        type: req.body.type,
        designation: req.body.designation,
        visaStatus: req.body.visaStatus,
        visaExpiringOn: req.body.visaExpiringOn,
        employeeId: req.body.employeeId,
        password: req.body.password,

        idProof: req.files?.idProof
          ? req.files.idProof[0].filename
          : null,

        employeePicture: req.files?.employeePicture
          ? req.files.employeePicture[0].filename
          : null
      });

      await newEmployee.save();

      res.json({ success: true });

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false });
    }
  }
);

module.exports = router;
