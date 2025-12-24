const API = "https://empmanage.onrender.com/employees";

/* =======================
   LOAD EMPLOYEES
======================= */
async function loadEmployees() {
  try {
    const searchInput = document.getElementById("search");
    const search = searchInput ? searchInput.value.trim() : "";

    const res = await fetch(`${API}?search=${search}`);
    if (!res.ok) throw new Error("Failed to fetch employees");

    const data = await res.json();

    const tbody = document.getElementById("employee-list");
    tbody.innerHTML = "";

    let totalSalary = 0;

    data.forEach(emp => {
      totalSalary += Number(emp.salary || 0);

      tbody.innerHTML += `
        <tr>
          <td><input id="name-${emp._id}" value="${emp.name}" /></td>
          <td><input id="position-${emp._id}" value="${emp.position}" /></td>
          <td><input id="salary-${emp._id}" type="number" value="${emp.salary}" /></td>
          <td>
            <button onclick="updateEmployee('${emp._id}')">Update</button>
            <button onclick="deleteEmployee('${emp._id}')">Delete</button>
          </td>
        </tr>
      `;
    });

    document.getElementById("total-employees").innerText = data.length;
    document.getElementById("total-salary").innerText = totalSalary;
  } catch (err) {
    console.error(err);
    alert("Error loading employees");
  }
}

/* =======================
   ADD EMPLOYEE
======================= */
async function addEmployee() {
  try {
    const name = document.getElementById("name").value.trim();
    const position = document.getElementById("position").value.trim();
    const salary = document.getElementById("salary").value;

    if (!name || !position || !salary) {
      alert("All fields are required");
      return;
    }

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, salary })
    });

    if (!res.ok) throw new Error("Failed to add employee");

    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("position").value = "";
    document.getElementById("salary").value = "";

    loadEmployees();
  } catch (err) {
    console.error(err);
    alert("Error adding employee");
  }
}

/* =======================
   UPDATE EMPLOYEE
======================= */
async function updateEmployee(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById(`name-${id}`).value,
        position: document.getElementById(`position-${id}`).value,
        salary: document.getElementById(`salary-${id}`).value
      })
    });

    if (!res.ok) throw new Error("Failed to update employee");

    loadEmployees();
  } catch (err) {
    console.error(err);
    alert("Error updating employee");
  }
}

/* =======================
   DELETE EMPLOYEE
======================= */
async function deleteEmployee(id) {
  try {
    if (!confirm("Delete this employee?")) return;

    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete employee");

    loadEmployees();
  } catch (err) {
    console.error(err);
    alert("Error deleting employee");
  }
}

/* =======================
   INITIAL LOAD
======================= */
loadEmployees();
