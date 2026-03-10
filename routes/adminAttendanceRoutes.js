const express = require("express");
const router = express.Router();

const adminAttendanceController = require("../controllers/adminAttendanceController");

router.post("/scan-in", adminAttendanceController.scanIn);

router.post("/scan-out", adminAttendanceController.scanOut);

router.get("/:adminId", adminAttendanceController.getAdminAttendance);

module.exports = router;