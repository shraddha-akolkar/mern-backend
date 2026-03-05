const express = require("express");
const router = express.Router();
const {
    scanAttendance,
    getAttendance
} = require("../controllers/attendanceController");

router.post("/scan", scanAttendance);
router.get("/", getAttendance);

module.exports = router;