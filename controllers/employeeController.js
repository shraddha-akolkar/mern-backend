const { Op } = require("sequelize");
const Employee = require("../models/Employee");

// FILTERING
exports.getEmployees = async (req, res) => {
    try {
        const { type, search, joiningDate, expiryDate } = req.query;

        let where = {};

        //  TYPE 
        if (type && type !== "All Employee") {
            where.type = {
                [Op.like]: `%${type}%`
            };
        }

        //  SEARCH
        if (search) {
            where.name = {
                [Op.like]: `%${search}%`
            };
        }

        // JOINING
        if (joiningDate) {
            where.createdAt = {
                [Op.between]: [
                    new Date(`${joiningDate} 00:00:00`),
                    new Date(`${joiningDate} 23:59:59`)]
            }
        }


        // EXPIRY 
        if (expiryDate) {
            where.visaExpiringOn = {
                [Op.between]: [
                    new Date(`${expiryDate} 00:00:00`),
                    new Date(`${expiryDate} 23:59:59`)]
            }
        }




        const employees = await Employee.findAll({ where });

        res.json({ employees });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


//  DELETE
exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.destroy({
            where: { id: req.params.id }
        });

        res.json({ message: "Deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};


//  UPDATE
exports.updateEmployee = async (req, res) => {
    try {
        await Employee.update(req.body, {
            where: { id: req.params.id }
        });

        res.json({ message: "Updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
