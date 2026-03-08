const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");

router.post("/create", leaveController.createLeave);
router.get("/", leaveController.getLeaves);
router.put("/:id/status", leaveController.updateLeaveStatus);

module.exports = router;