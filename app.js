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

async function viewAllEmp() {
  const query =
    "SELECT first_name, last_name, title, salary, name AS department, manager_id FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id";

  const data = await connection.query(query);
  console.table(data);
  init();
}

async function viewByDepart() {
  const department = await prompt({
    name: "department",
    message: "What department would you like to chose?",
    choices: ["Sales", "Engineering", "Finance", "Legal"],
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
  const query = "SELECT *FROM department";

  const data = await connection.query(query);
  console.table(data);
  init();
}
async function viewAllRoles() {
  const query =
    "SELECT * FROM role";

  const data = await connection.query(query);
  console.table(data);
  init();
}

async function addEmployee() {
  const { first_name, last_name, role, salary } = await prompt([
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
      choices: ["Salesperson", "Software Engineer", "Accountant", "Lawyer"],
    },
    {
      type: "number",
      name: "salary",
      message: "What is employee's salary",
    },
  ]);

  const query1 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const query2 = `INSERT INTO role (title, salary) VALUES (?, ?)`;
  let depID;
  let roleID;
  let manager_id;
  if (role === "Salesperson") {
    depID = 1;
    roleID = 2;
    manager_id = 3;
  }
  if (role === "Software Engineer") {
    depID = 2;
    roleID = 4;
    manager_id = 3;
  }
  if (role === "Accountant") {
    depID = 3;
    roleID = 5;
  }
  if (role === "Lawyer") {
    depID = 4;
    roleID = 6;
    manager_id = 7;
  }

  const query3 = `UPDATE role SET department_id = ? WHERE title = ?`;

  const data1 = await connection.query(query1, [
    first_name,
    last_name,
    roleID,
    manager_id,
  ]);
  const data2 = await connection.query(query2, [role, salary]);
  const data3 = await connection.query(query3, [depID, role]);

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
  console.log(department);

  const data = await connection.query(query, [department]);
  console.log("New department added!");
  init();
}
async function addRole() {
  const { title, salary } = await prompt(
    {
      name: "title",
      message: "What role would you like to add?",
      type: "input",
    },
    {
      type: "number",
      name: "salary",
      message: "What is the salary for this role",
    },
    {
      name: "belongTo",
      message: "What department new role belongs to?",
      choices: ["Sales", "Engineering", "Finance", "Legal"],
    }
  );

  const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?)`;
  console.log(title, salary);

  const data = await connection.query(query, [title, salary]);
  console.log("New role added!");
  init();
}
