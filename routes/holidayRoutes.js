const express = require("express");
const router = express.Router();
const multer = require("multer");

const holidayController = require("../controllers/holidayController");

const upload = multer({ dest: "uploads/" });

router.get("/", holidayController.getHolidays);

router.post("/", upload.single("image"), holidayController.createHoliday);

router.delete("/:id", holidayController.deleteHoliday);

router.put("/:id", upload.single("image"), holidayController.updateHoliday);

module.exports = router;