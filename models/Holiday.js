const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Holiday = sequelize.define("Holiday", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    day: {
        type: DataTypes.STRING,
        allowNull: false
    },

    image: {
        type: DataTypes.STRING
    },

    description: {
        type: DataTypes.STRING
    }

}, {
    timestamps: true
});

module.exports = Holiday;