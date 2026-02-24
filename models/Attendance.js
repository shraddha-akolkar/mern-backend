const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee');
const Attendance = sequelize.define('Attendance', {
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
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    overtime: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});


Employee.hasMany(Attendance, { foreignKey: 'employeeId', });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });







module.exports = Attendance;