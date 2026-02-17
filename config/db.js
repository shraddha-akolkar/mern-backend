const { Sequelize } = require("sequelize");

const Db_name = "employee_management";
const Db_user = "root";
const Db_password = "";
const Db_host = "localhost";


const sequelize = new Sequelize(Db_name, Db_user, Db_password, {
  host: Db_host,
  dialect: "mysql",
  logging: false
});

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log("DB Error:", err));

module.exports = sequelize;
