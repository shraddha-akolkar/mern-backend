const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Meeting = sequelize.define("Meeting", {
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    employee: {
        type: DataTypes.STRING,
        allowNull: false
    },

    clientAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    dayType: {
        type: DataTypes.STRING
    },

    shiftType: {
        type: DataTypes.STRING
    },

    date: {
        type: DataTypes.DATEONLY
    },

    service: {
        type: DataTypes.STRING
    },

})

module.exports = Meeting;