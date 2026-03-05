const Meeting = require("../models/Meeting");

/* CREATE MEETING */
exports.createMeeting = async (req, res) => {
    try {

        const {
            clientName,
            employee,
            clientAddress,
            dayType,
            shiftType,
            date,
            service
        } = req.body;

        const meeting = await Meeting.create({
            clientName,
            employee,
            clientAddress,
            dayType,
            shiftType,
            date,
            service
        });

        res.status(201).json({
            message: "Meeting created successfully",
            meeting
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Meeting creation failed" });
    }
};


/* GET MEETINGS */
exports.getMeetings = async (req, res) => {
    try {

        const meetings = await Meeting.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.json({ meetings });

    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};