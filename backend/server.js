require("dotenv").config(); // ✅ add this

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());

/* ================== MONGODB ================== */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ================== SCHEMA ================== */
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true }
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

/* ================== ROUTES ================== */

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Employee Management Backend is Running 🚀");
});

// GET employees (with optional search)
app.get("/employees", async (req, res) => {
  try {
    const search = req.query.search || "";
    const employees = await Employee.find({
      name: { $regex: search, $options: "i" }
    });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// ADD employee
app.post("/employees", async (req, res) => {
  try {
    const { name, position, salary } = req.body;

    if (!name || !position || salary === undefined) {
      return res.status(400).json({ message: "All fields required" });
    }

    const employee = new Employee({ name, position, salary });
    await employee.save();

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to add employee" });
  }
});

// UPDATE employee
app.put("/employees/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Failed to update employee" });
  }
});

// DELETE employee
app.delete("/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

/* ================== SERVER ================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
