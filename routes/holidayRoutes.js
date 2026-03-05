const express = require("express");
const router = express.Router();

const holidayController = require("../controllers/holidayController");

router.get("/", holidayController.getHolidays);

router.post("/", holidayController.createHoliday);

router.delete("/:id", holidayController.deleteHoliday);

router.put("/:id", holidayController.updateHoliday);

module.exports = router;