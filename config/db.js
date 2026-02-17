const { Sequelize } = require("sequelize");

const Db_name = "employee_management";
const Db_user = "root";
const Db_password = "";
const Db_host = "localhost";


const sequelize = new Sequelize("employee_management", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log("DB Error:", err));

module.exports = sequelize;
