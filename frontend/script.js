const API = "https://empmanage.onrender.com/backend/employees";


async function loadEmployees() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    const tbody = document.getElementById("employee-list");
    tbody.innerHTML = "";

    let totalSalary = 0;

    data.forEach(emp => {
      totalSalary += Number(emp.salary || 0);

      tbody.innerHTML += `
        <tr>
          <td><input id="name-${emp._id}" value="${emp.name}"></td>
          <td><input id="position-${emp._id}" value="${emp.position}"></td>
          <td><input id="salary-${emp._id}" type="number" value="${emp.salary}"></td>
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

async function addEmployee() {
  try {
    const name = document.getElementById("name").value.trim();
    const position = document.getElementById("position").value.trim();
    const salary = document.getElementById("salary").value;

    if (!name || !position || !salary) {
      alert("All fields required");
      return;
    }

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, salary })
    });

    if (!res.ok) throw new Error("Add failed");

    document.getElementById("name").value = "";
    document.getElementById("position").value = "";
    document.getElementById("salary").value = "";

    loadEmployees();
  } catch (err) {
    console.error(err);
    alert("Error adding employee");
  }
}

async function updateEmployee(id) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById(`name-${id}`).value,
      position: document.getElementById(`position-${id}`).value,
      salary: document.getElementById(`salary-${id}`).value
    })
  });

  loadEmployees();
}

async function deleteEmployee(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadEmployees();
}

loadEmployees();
