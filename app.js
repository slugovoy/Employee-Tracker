const { prompt } = require("inquirer");
const connection = require("./db");

init();

async function init() {
  const { action } = await prompt({
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "View All Departments",
      "View All Roles",
      "Add Employee",
      "Add Department",
      "Add Role",
      "Update employee roles",
      "Remove Employee",
      "EXIT",
    ],
    type: "list",
  });

  switch (action) {
    case "View All Employees":
      viewAllEmp();
      break;
    case "View All Employees By Department":
      viewByDepart();
      break;
    case "View All Employees By Manager":
      viewByManager();
      break;
    case "View All Departments":
      viewAllDep();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Add Role":
      addRole();
      break;
    case "Update employee roles":
      updateEmpRoles();
    case "Remove Employee":
      removeEmployee();
      break;
      break;
    default:
      process.exit(0);
  }
}
// Methods
async function getDepsInArray() {
  const query = `SELECT name, id FROM department`;
  const data = await connection.query(query);

  return data;
}

async function getRolesInArray() {
  const query = `SELECT title, id FROM role`;
  const data = await connection.query(query);

  return data;
}
async function getEmpsInArray() {
  const query = `SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee`;
  const data = await connection.query(query);

  return data;
}

async function viewAllEmp() {
  const query =
    "SELECT first_name, last_name, title, salary, name AS department, manager_id FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id";

  const data = await connection.query(query);
  console.table(data);
  init();
}

async function viewByDepart() {
  const depsArray = await getDepsInArray();

  const department = await prompt({
    name: "department",
    message: "What department would you like to chose?",
    choices: [...depsArray],
    type: "list",
  });

  const query = `SELECT first_name, last_name, title, salary
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id 
    INNER JOIN department ON role.department_id= department.id 
    WHERE department.name = ?`;

  const data = await connection.query(query, department.department);
  console.table(data);
  init();
}
async function viewByManager() {
  const { manager } = await prompt({
    name: "manager",
    message: "What manager would you like to chose?",
    choices: ["John Doe", "Mary Smith", "Gary Stone"],
    type: "list",
  });
  let manID;
  if (manager === "John Doe") {
    manID = 1;
  }
  if (manager === "Mary Smith") {
    manID = 3;
  }
  if (manager === "Gary Stone") {
    manID = 7;
  }

  const query = `SELECT first_name, last_name, title, salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.id  
    WHERE manager_id = ?`;

  console.log(manager.manager);

  const data = await connection.query(query, manID);
  console.table(data);
  init();
}
async function viewAllDep() {
  const query = "SELECT name FROM department";

  const data = await connection.query(query);
  console.table(data);
  init();
}
async function viewAllRoles() {
  const query = "SELECT title, salary FROM role";

  const data = await connection.query(query);
  console.table(data);
  init();
}

async function addEmployee() {
  const rolesArray = await getRolesInArray();
  const { first_name, last_name, role } = await prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is employee first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is employee last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is employee role?",
      choices: rolesArray.map((roleItem) => ({
        name: roleItem.title,
        value: roleItem.id,
      })),
    },
  ]);
  console.log(role);

  const query1 = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
  const data1 = await connection.query(query1, [first_name, last_name, role]);

  console.log("New employee was added!");

  init();
}

async function addDepartment() {
  const { department } = await prompt({
    name: "department",
    message: "What department would you like to add?",
    type: "input",
  });

  const query = `INSERT INTO department (name) VALUES (?)`;

  const data = await connection.query(query, [department]);
  console.log("New department added!");
  init();
}
async function addRole() {
  const depsArray = await getDepsInArray();
  const { title, salary, belongsTo } = await prompt([
    {
      name: "title",
      message: "What role would you like to add?",
      type: "input",
    },
    {
      name: "salary",
      type: "number",
      message: "What is the salary for this role?",
    },
    {
      name: "belongsTo",
      type: "list",
      message: "What department new role belongs to?",
      choices: depsArray.map((depsItem) => ({
        name: depsItem.name,
        value: depsItem.id,
      })),
    },
  ]);
  console.log(belongsTo);

  const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

  const data = await connection.query(query, [title, salary, belongsTo]);
  console.log("New role added!");
  init();
}

async function updateEmpRoles() {
  const empsInArray = await getEmpsInArray();
  const rolesArray = await getRolesInArray();
  const { empName, newRole } = await prompt([
    {
      name: "empName",
      type: "list",
      choices: empsInArray.map((employee) => ({
        name: employee.name,
        value: employee.id,
      })),
      message: "What employee do you want to update?",
    },
    {
      name: "newRole",
      type: "list",
      choices: rolesArray.map((roleItem) => ({
        name: roleItem.title,
        value: roleItem.id,
      })),
      message: "What role do you want to give?",
    },
  ]);
  console.log(empName, newRole);

  const query = `UPDATE employee SET role_id = ? WHERE id = ?;`;

  const data = await connection.query(query, [newRole, empName]);
  console.log("Employee's role updated!");
  init();
}

async function removeEmployee() {
  const empsInArray = await getEmpsInArray();
  const { empName } = await prompt([
    {
      name: "empName",
      type: "list",
      choices: empsInArray.map((employee) => ({
        name: employee.name,
        value: employee.id,
      })),
      message: "What employee do you want to remove?",
    },
  ]);

  const query = `DELETE FROM employee WHERE id = ?`;

  const data = await connection.query(query, [empName]);
  console.log("Employee deleted!");
  init();
}
