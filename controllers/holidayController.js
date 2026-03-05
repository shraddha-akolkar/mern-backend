const Holiday = require("../models/Holiday");
const { Op } = require("sequelize");


/*Filter by month or search*/
exports.getHolidays = async (req, res) => {
    try {

        const { month, search } = req.query;

        let where = {};

        //  NAME
        if (search) {
            where.title = {
                [Op.like]: `%${search}%`
            };
        }

        //  MONTH
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



/*CREATE */
exports.createHoliday = async (req, res) => {
    try {

        const { title, date, day, description } = req.body;

        const image = req.file ? req.file.filename : null;

        const holiday = await Holiday.create({
            title,
            date,
            day,
            description,
            image

        });
        console.log(req.body);
        console.log(req.file);
        return res.status(201).json({
            message: "Holiday created successfully",
            holiday
        });

    } catch (error) {
        console.log("Create Holiday Error:", error);
        return res.status(500).json({ message: "Create failed" });
    }

};


/*DELETE */
exports.deleteHoliday = async (req, res) => {
    try {

        const id = req.params.id;

        const holiday = await Holiday.findByPk(id);

        if (!holiday) {
            return res.status(404).json({ message: "Holiday not found" });
        }

        await holiday.destroy();

        res.json({ message: "Holiday deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Delete failed" });
    }
};



/*UPDATE*/
exports.updateHoliday = async (req, res) => {
    try {

        const { title, date, day } = req.body;

        let updateData = {
            title,
            date,
            day
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await Holiday.update(updateData, {
            where: { id: req.params.id }
        });

        res.json({ message: "Holiday updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Update failed" });
    }
};