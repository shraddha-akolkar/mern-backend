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
        if (!attendance.outTime) {

            const inTime = new Date(`${today}T${attendance.inTime}`);
            const outTime = new Date();

            const diffMinutes = Math.floor((outTime - inTime) / 60000);

            let overtime = 0;

            if (diffMinutes > 480) { // 8 hours
                overtime = diffMinutes - 480;
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