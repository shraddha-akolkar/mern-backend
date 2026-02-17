const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");

router.get("/", employeeController.getEmployees);
router.delete("/:id", employeeController.deleteEmployee);
router.put("/:id", employeeController.updateEmployee);

module.exports = router;
