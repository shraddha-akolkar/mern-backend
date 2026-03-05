const Meeting = require("../models/Meeting");

/* CREATE */
exports.createMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.create(req.body);

        res.status(201).json({
            message: "Meeting created successfully",
            meeting
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Create failed" });
    }
};


/* GET ALL */
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


/* DELETE */
exports.deleteMeeting = async (req, res) => {
    try {

        const id = req.params.id;

        const meeting = await Meeting.findByPk(id);

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        await meeting.destroy();

        res.json({ message: "Meeting deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};


/* UPDATE */
exports.updateMeeting = async (req, res) => {
    try {

        const id = req.params.id;

        await Meeting.update(req.body, {
            where: { id }
        });

        res.json({ message: "Meeting updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};