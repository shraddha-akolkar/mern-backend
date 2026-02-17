const Employee = require("../models/Employee");

exports.getEmployees = async (req, res) => {
  try {
    const { type, search } = req.query;

    let where = {};

    if (type && type !== "All Employee") {
      where.type = type;
    }

    if (search) {
      where.name = search;
    }

    const employees = await Employee.findAll({ where });

    const formattedEmployees = employees.map(emp => {
      const today = new Date();
      const joiningDate = new Date(emp.createdAt);

      // -------- TOTAL EXPERIENCE --------
      const diffTime = today - joiningDate;
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // -------- VISA CALCULATION --------
      let visaType = "valid";
      let visaDays = null;

      if (emp.visaExpiringOn) {
        const visaDate = new Date(emp.visaExpiringOn);
        const diffVisa = Math.floor((visaDate - today) / (1000 * 60 * 60 * 24));

        if (diffVisa < 0) {
          visaType = "expired";
        } else if (diffVisa <= 30) {
          visaType = "expiring";
          visaDays = diffVisa;
        }
      }

      return {
        id: emp.id,
        name: emp.name,
        designation: emp.designation,
        type: emp.type,
        joiningDate: joiningDate.toISOString().split("T")[0],
        visaStatus: emp.visaExpiringOn,
        visaType,
        visaDays,
        totalExperience: `${totalDays} days`,
        idProof: emp.idProof
          ? `http://localhost:5000/uploads/${emp.idProof}`
          : null
      };
    });

    res.json({ employees: formattedEmployees });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};


// update employee
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
