const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model("Employee", EmployeeSchema);

// ✅ TEST ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ GET employees
app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// ✅ POST employee
app.post("/employees", async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on", PORT));
