const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const leaveController = require("../controllers/leaveController");

router.post("/create", leaveController.createLeave);


// GET ALL LEAVES
router.get("/", async (req, res) => {
    try {
        const leaves = await Leave.findAll({
            include: [
                {
                    model: Employee,
                    attributes: ["id", "name", "designation", "type", "employeePicture", "visaExpiringOn"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



// existing route
router.get("/employee/:id", async (req, res) => {
    try {

        const leaves = await Leave.findAll({
            where: { employeeId: req.params.id },
            include: [
                {
                    model: Employee,
                    attributes: ["id", "name", "designation",
                        "type", "employeePicture", "visaExpiringOn",]
                }
            ]
        });

        res.json(leaves);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/:id/status", leaveController.updateLeaveStatus);

module.exports = router;