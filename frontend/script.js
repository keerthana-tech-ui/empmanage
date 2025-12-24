// ✅ Backend URL (Render)
const API_URL = "https://empmanage.onrender.com/employees";

// ================= LOAD EMPLOYEES =================
async function loadEmployees() {
  try {
    const search = document.getElementById("search").value || "";

    const res = await fetch(`${API_URL}?search=${search}`);
    if (!res.ok) throw new Error("Failed to fetch employees");

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

// ================= ADD EMPLOYEE =================
async function addEmployee() {
  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value.trim();
  const salary = document.getElementById("salary").value;

  if (!name || !position || !salary) {
    alert("All fields required");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, position, salary })
  });

  document.getElementById("name").value = "";
  document.getElementById("position").value = "";
  document.getElementById("salary").value = "";

  loadEmployees();
}

// ================= UPDATE EMPLOYEE =================
async function updateEmployee(id) {
  const emp = {
    name: document.getElementById(`name-${id}`).value,
    position: document.getElementById(`position-${id}`).value,
    salary: document.getElementById(`salary-${id}`).value
  };

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emp)
  });

  loadEmployees();
}

// ================= DELETE EMPLOYEE =================
async function deleteEmployee(id) {
  if (!confirm("Delete this employee?")) return;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  loadEmployees();
}

// ================= INITIAL LOAD =================
loadEmployees();
