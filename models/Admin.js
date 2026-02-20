const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admin = sequelize.define("Admin",{
    
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },

    
    
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    timestamps: false
}
);


module.exports = Admin;