const Leave = require("../models/Leave");


// CREATE
exports.createLeave = async (req, res) => {
    try {

        const { employeeId, fromDate, toDate, remark } = req.body;

        const start = new Date(fromDate);
        const end = new Date(toDate);

        const totalDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

        const leave = await Leave.create({
            employeeId,
            fromDate,
            toDate,
            totalDays,
            remark
        });

        res.status(201).json(leave);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET
exports.getLeaves = async (req, res) => {
    try {

        const leaves = await Leave.findAll({
            include: ["Employee"]
        });

        res.json(leaves);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// UPDATE
exports.updateLeaveStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        await Leave.update(
            { status },
            { where: { id } }
        );

        res.json({ message: "Leave updated" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};