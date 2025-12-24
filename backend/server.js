const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

/* -------------------- MODEL -------------------- */
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true }
});

const Employee = mongoose.model("Employee", EmployeeSchema);

/* -------------------- ROUTES -------------------- */

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Employee Management API is running 🚀");
});

// GET employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// POST employee
app.post("/employees", async (req, res) => {
  try {
    const { name, position, salary } = req.body;

    if (!name || !position || !salary) {
      return res.status(400).json({ message: "All fields required" });
    }

    const employee = new Employee({
      name,
      position,
      salary
    });

    await employee.save();
    res.status(201).json(employee);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add employee" });
  }
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
