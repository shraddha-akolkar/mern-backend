const express = require("express");
const router = express.Router();

const {
  getEmployees,
  deleteEmployee,
  updateEmployee
} = require("../controllers/employeeController");

router.get("/", getEmployees);
router.delete("/:id", deleteEmployee);
router.put("/:id", updateEmployee);

module.exports = router;
