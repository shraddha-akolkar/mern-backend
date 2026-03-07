const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./Employee");

const Attendance = sequelize.define("Attendance", {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    inTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    outTime: {
        type: DataTypes.TIME,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER, // minutes
        allowNull: true
    },
    overtime: {
        type: DataTypes.INTEGER, // minutes
        allowNull: true
    },

}, {
    timestamps: true
});

Employee.hasMany(Attendance, { foreignKey: "employeeId" });
Attendance.belongsTo(Employee, { foreignKey: "employeeId" });

module.exports = Attendance;