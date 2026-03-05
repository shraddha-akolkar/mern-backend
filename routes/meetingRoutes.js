const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");

router.get("/", meetingController.getMeetings);

router.post("/", meetingController.createMeeting);

router.put("/:id", meetingController.updateMeeting);

router.delete("/:id", meetingController.deleteMeeting);

module.exports = router;