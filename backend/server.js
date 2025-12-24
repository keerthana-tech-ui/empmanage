const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const Employee = mongoose.model("Employee", new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
}));

app.get("/employees", async (req, res) => {
  const search = req.query.search || "";
  const employees = await Employee.find({
    name: { $regex: search, $options: "i" }
  });
  res.json(employees);
});

app.post("/employees", async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
});

app.put("/employees/:id", async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

app.delete("/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running on", PORT));
