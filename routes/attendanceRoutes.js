const express = require("express");
const router = express.Router();

const {
    scanAttendance,
    getAttendance,
    getEmployeeAttendance
} = require("../controllers/attendanceController");

router.post("/scan", scanAttendance);
router.get("/", getAttendance);
router.get("/:employeeId", getEmployeeAttendance);

module.exports = router;