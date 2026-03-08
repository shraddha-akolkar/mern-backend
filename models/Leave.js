const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./Employee");

const Leave = sequelize.define("Leave", {

    fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    toDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    totalDays: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    remark: {
        type: DataTypes.STRING,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending"
    }

}, {
    timestamps: true
});

Employee.hasMany(Leave, { foreignKey: "employeeId" });
Leave.belongsTo(Employee, { foreignKey: "employeeId" });

module.exports = Leave;