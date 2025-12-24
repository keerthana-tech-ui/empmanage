const API = "https://empmanage.onrender.com/employees";

async function loadEmployees() {
  const search = document.getElementById("search").value || "";
  const res = await fetch(`${API}?search=${search}`);
  const data = await res.json();

  const tbody = document.getElementById("employee-list");
  tbody.innerHTML = "";

  let totalSalary = 0;

  data.forEach(emp => {
    totalSalary += Number(emp.salary);
    tbody.innerHTML += `
      <tr>
        <td><input id="name-${emp._id}" value="${emp.name}"></td>
        <td><input id="position-${emp._id}" value="${emp.position}"></td>
        <td><input id="salary-${emp._id}" value="${emp.salary}"></td>
        <td>
          <button onclick="updateEmployee('${emp._id}')">Update</button>
          <button onclick="deleteEmployee('${emp._id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("total-employees").innerText = data.length;
  document.getElementById("total-salary").innerText = totalSalary;
}

async function addEmployee() {
  const name = document.getElementById("name").value;
  const position = document.getElementById("position").value;
  const salary = document.getElementById("salary").value;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, position, salary })
  });

  loadEmployees();
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
