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
app.use("/api/holidays", require("./routes/holidayRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/leave", require("./routes/leaveRoutes"));
app.use("/api/admin-attendance", require("./routes/adminAttendanceRoutes"));

require("./models/Holiday");
require("./models/Admin");
require("./models/Employee");
require("./models/Attendance");
require("./models/Meeting");
require("./models/Leave");
require("./models/AdminAttendance");

sequelize.sync()
  .then(() => console.log("Database Synced"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});