const express = require("express");
const router = express.Router();
const multer = require("multer");
const { register } = require("../controllers/authController");

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post(
  "/register",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "employeePicture", maxCount: 1 }
  ]),
  register
);

module.exports = router;
