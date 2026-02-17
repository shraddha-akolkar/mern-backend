const { Op } = require("sequelize");
const Employee = require("../models/Employee");

// ✅ GET EMPLOYEES WITH FILTERING
exports.getEmployees = async (req, res) => {
  try {
    const { type, search } = req.query;

    let where = {};

    // ✅ TYPE FILTER (case-insensitive)
    if (type && type !== "All Employee") {
      where.type = {
        [Op.like]: `%${type}%`
      };
    }

    // ✅ SEARCH FILTER
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    const employees = await Employee.findAll({ where });

    res.json({ employees });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ DELETE
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


// ✅ UPDATE
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
