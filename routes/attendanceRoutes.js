const express = require("express");
const router = express.Router();

const {
    scanAttendance,
    getAttendance,
    getEmployeeAttendance,
    deleteAttendance,
    updateAttendance
} = require("../controllers/attendanceController");

router.post("/scan", scanAttendance);

router.get("/", getAttendance);

router.get("/:employeeId", getEmployeeAttendance);

router.delete("/:id", deleteAttendance);

router.put("/:id", updateAttendance);

module.exports = router;