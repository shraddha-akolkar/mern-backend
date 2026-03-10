const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Admin = require("./Admin");

const AdminAttendance = sequelize.define("AdminAttendance", {

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
    }

}, {
    timestamps: true
});

Admin.hasMany(AdminAttendance, { foreignKey: "adminId" });
AdminAttendance.belongsTo(Admin, { foreignKey: "adminId" });

module.exports = AdminAttendance;