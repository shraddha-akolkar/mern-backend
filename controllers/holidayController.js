const Holiday = require("../models/Holiday");
const { Op } = require("sequelize");


/*
GET HOLIDAYS
Filter by month or search
*/
exports.getHolidays = async (req, res) => {
    try {

        const { month, search } = req.query;

        let where = {};

        // SEARCH BY NAME
        if (search) {
            where.title = {
                [Op.like]: `%${search}%`
            };
        }

        // FILTER BY MONTH
        if (month && month !== "All") {

            const start = new Date(`2026-${month}-01`);
            const end = new Date(`2026-${month}-31`);

            where.date = {
                [Op.between]: [start, end]
            };
        }

        const holidays = await Holiday.findAll({
            order: [["date", "ASC"]]
        });

        res.json({ holidays });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};



/*
CREATE HOLIDAY
*/
exports.createHoliday = async (req, res) => {
    try {

        const { title, date, day, description } = req.body;

        const holiday = await Holiday.create({
            title,
            date,
            day,
            description,
            image: req.file ? req.file.filename : null
        });

        res.json({
            message: "Holiday created successfully",
            holiday
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Create failed" });
    }
};



/*
DELETE HOLIDAY
*/
exports.deleteHoliday = async (req, res) => {
    try {

        await Holiday.destroy({
            where: { id: req.params.id }
        });

        res.json({ message: "Holiday deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};



/*
UPDATE HOLIDAY
*/
exports.updateHoliday = async (req, res) => {
    try {

        await Holiday.update(req.body, {
            where: { id: req.params.id }
        });

        res.json({ message: "Holiday updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};