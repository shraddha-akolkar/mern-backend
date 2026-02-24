const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


require("./models/Admin");
require("./models/Employee");
require("./models/Attendance")


sequelize.sync({ alter: true })
  .then(() => console.log("Database Synced"))
  .catch(err => console.log(err));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});