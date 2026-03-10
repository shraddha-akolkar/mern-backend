const AdminAttendance = require("../models/AdminAttendance");

exports.scanIn = async (req, res) => {
    try {
        const { adminId } = req.body;

        const today = new Date().toISOString().split("T")[0];
        const time = new Date().toTimeString().split(" ")[0];

        const existing = await AdminAttendance.findOne({
            where: { adminId, date: today },
        });

        if (existing) {
            return res.json({ message: "Already scanned in today" });
        }

        const attendance = await AdminAttendance.create({
            adminId,
            date: today,
            inTime: time,
        });

        res.json({ message: "Scan In Successful", attendance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.scanOut = async (req, res) => {
    try {
        const { adminId } = req.body;

        const today = new Date().toISOString().split("T")[0];
        const time = new Date().toTimeString().split(" ")[0];

        const record = await AdminAttendance.findOne({
            where: { adminId, date: today },
        });

        if (!record) {
            return res.status(400).json({ message: "Scan in first" });
        }

        const inTime = new Date(`1970-01-01T${record.inTime}`);
        const outTime = new Date(`1970-01-01T${time}`);

        const duration = Math.floor((outTime - inTime) / 60000);

        let overtime = 0;
        if (duration > 480) {
            overtime = duration - 480;
        }

        record.outTime = time;
        record.duration = duration;
        record.overtime = overtime;

        await record.save();

        res.json({ message: "Scan Out Successful", record });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAdminAttendance = async (req, res) => {
    try {
        const { adminId } = req.params;

        const records = await AdminAttendance.findAll({
            where: { adminId },
            order: [["date", "DESC"]],
        });

        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};