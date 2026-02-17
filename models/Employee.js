const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Employee = sequelize.define("Employee", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visaStatus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visaExpiringOn: {
    type: DataTypes.DATEONLY
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idProof: {
    type: DataTypes.STRING
  },
  employeePicture: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Employee;
