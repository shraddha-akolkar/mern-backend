const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const upload = require("../middleware/upload");

router.get("/", employeeController.getEmployees);

router.delete("/:id", employeeController.deleteEmployee);

router.put(
    "/:id",
    upload.fields([
        { name: "idProof", maxCount: 1 },
        { name: "employeePicture", maxCount: 1 }
    ]),
    employeeController.updateEmployee
);

module.exports = router;