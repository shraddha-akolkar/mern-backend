const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");


// SCAN IN / SCAN OUT
exports.scanAttendance = async (req, res) => {
    try {

        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: "Employee ID required" });
        }

        const today = new Date().toISOString().split("T")[0];
        const now = new Date();

        const currentTime = now.toTimeString().split(" ")[0];

        // check scanned today
        let attendance = await Attendance.findOne({
            where: { employeeId, date: today }
        });

        // SCAN IN
        if (!attendance) {

            attendance = await Attendance.create({
                employeeId,
                date: today,
                inTime: currentTime
            });

            return res.json({
                message: "Scan In successful",
                attendance
            });
        }

        // SCAN OUT
        if (!attendance.outTime || attendance.outTime === "00:00:00") {

            const start = new Date(`${today}T${attendance.inTime}`);
            const end = new Date(`${today}T${currentTime}`);

            const diffMinutes = Math.floor((end - start) / 60000);

            const REQUIRED_WORK = 360;

            let overtime = 0;

            if (diffMinutes > REQUIRED_WORK) {
                overtime = diffMinutes - REQUIRED_WORK;
            }

            await attendance.update({
                outTime: currentTime,
                duration: diffMinutes,
                overtime
            });

            return res.json({
                message: "Scan Out successful",
                attendance
            });
        }

        return res.json({
            message: "Attendance already completed for today"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



// GET ATTENDANCE

exports.getAttendance = async (req, res) => {
    try {

        const data = await Attendance.findAll({
            include: [
                {
                    model: Employee,
                    attributes: ["id", "name", "designation", "type", "employeePicture"]
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
                    attributes: ["id", "name", "designation", "type", "employeePicture"]
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

        const date = attendance.date;

        const start = new Date(`${date}T${inTime}`);
        const end = new Date(`${date}T${outTime}`);

        const diffMinutes = Math.floor((end - start) / 60000);

        if (diffMinutes < 0) {
            return res.status(400).json({
                message: "Out time must be after In time"
            });
        }

        const REQUIRED_WORK_MINUTES = 360;

        let overtime = 0;

        if (diffMinutes > REQUIRED_WORK_MINUTES) {
            overtime = diffMinutes - REQUIRED_WORK_MINUTES;
        }

        await attendance.update({
            inTime,
            outTime,
            duration: diffMinutes,
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