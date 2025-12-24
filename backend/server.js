const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model("Employee", EmployeeSchema);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.get("/employees", async (req, res) => {
  const search = req.query.search || "";
  const data = await Employee.find({
    name: { $regex: search, $options: "i" }
  });
  res.json(data);
});

app.post("/employees", async (req, res) => {
  const emp = await Employee.create(req.body);
  res.json(emp);
});

app.put("/employees/:id", async (req, res) => {
  const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(emp);
});

app.delete("/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
