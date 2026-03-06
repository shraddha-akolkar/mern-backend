const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");


// SCAN IN / SCAN OUT
exports.scanAttendance = async (req, res) => {
    try {

        const { employeeId } = req.body;

        const today = new Date().toISOString().split("T")[0];
        const now = new Date();
        const time = now.toTimeString().split(" ")[0];

        let attendance = await Attendance.findOne({
            where: {
                employeeId,
                date: today
            }
        });

        // SCAN IN
        if (!attendance) {

            attendance = await Attendance.create({
                employeeId,
                date: today,
                inTime: time
            });

            return res.json({
                message: "Scan In Successful",
                type: "IN",
                attendance
            });
        }

        // SCAN OUT
        if (!attendance.outTime || attendance.outTime === "00:00:00") {

            const inTime = new Date(`${today}T${attendance.inTime}`);
            const outTime = new Date();

            const diffMinutes = Math.floor((outTime - inTime) / 60000);

            let overtime = 0;

            if (diffMinutes > 1) {
                overtime = diffMinutes - 1;
            }

            attendance.outTime = time;
            attendance.duration = diffMinutes;
            attendance.overtime = overtime;

            await attendance.save();

            return res.json({
                message: "Scan Out Successful",
                type: "OUT",
                attendance
            });
        }

        return res.json({
            message: "Already scanned out today"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// GET ATTENDANCE WITH EMPLOYEE DATA

exports.getAttendance = async (req, res) => {
    try {

        const data = await Attendance.findAll({
            include: [
                {
                    model: Employee,
                    attributes: ["id", "name", "designation", "type"]
                }
            ],
            order: [["date", "DESC"]]
        });

        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET EMPLOYEE ATTENDANCE

exports.getEmployeeAttendance = async (req, res) => {
    try {

        const { employeeId } = req.params;

        const data = await Attendance.findAll({
            where: { employeeId },
            include: [
                {
                    model: Employee,
                    attributes: ["id", "name", "designation", "type"]
                }
            ],
            order: [["date", "DESC"]]
        });

        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE 
exports.deleteAttendance = async (req, res) => {
    try {

        const { id } = req.params;

        const attendance = await Attendance.findByPk(id);

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        await attendance.destroy();

        res.json({ message: "Attendance deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// UPDATE
exports.updateAttendance = async (req, res) => {
    try {

        const { id } = req.params;

        const { inTime, outTime } = req.body;

        const attendance = await Attendance.findByPk(id);

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        let duration = null;
        let overtime = null;

        if (inTime && outTime) {

            const today = attendance.date;

            const start = new Date(`${today}T${inTime}`);
            const end = new Date(`${today}T${outTime}`);

            const diffMinutes = Math.floor((end - start) / 60000);

            duration = diffMinutes;

            if (diffMinutes > 480) {
                overtime = diffMinutes - 480;
            } else {
                overtime = 0;
            }

        }

        await attendance.update({
            inTime,
            outTime,
            duration,
            overtime
        });

        res.json({
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};