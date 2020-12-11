const { prompt } = require("inquirer");
const connection = require("./db");
const logo = require("asciiart-logo");
const config = require("./package.json");
const { viewAllEmp, viewByDepart, viewByManager, viewAllDep, viewAllRoles  } = require("./Assets/view.js")
const { addEmployee, addDepartment, addRole } = require("./Assets/addEmpDeptRole.js")
const { removeEmployee, removeRole, removeDepartment  } = require("./Assets/removeEmpDeptRole.js")
const { getDepsInArray, getRolesInArray, getEmpsInArray } = require("./Assets/methods.js");

console.log(
  logo({
    name: "EMPLOYEE TRACKER",
    font: "DOOM",
    lineChars: 14,
    padding: 8,
    margin: 8,
    borderColor: "bold-green",
    logoColor: "bold-red",
    textColor: "green",
  })
    .emptyLine()
    .right("version 3.7.123")
    .emptyLine()
    .render()
);
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
      "Remove Role",
      "Remove Department",
      "View total budget of department",
      "EXIT",
    ],
    type: "list",
  });

  switch (action) {
    case "View All Employees":
      await viewAllEmp();
      init();
      break;
    case "View All Employees By Department":
      await viewByDepart();
      init();
      break;
    case "View All Employees By Manager":
      await viewByManager();
      init();
      break;
    case "View All Departments":
      await viewAllDep();
      init();
      break;
    case "View All Roles":
      await viewAllRoles();
      init();
      break;
    case "Add Employee":
      await addEmployee();
      init();
      break;
    case "Add Department":
      await addDepartment();
      init();
      break;
    case "Add Role":
      await addRole();
      init();
      break;
    case "Update employee roles":
      await updateEmpRoles();
      break;
    case "Remove Employee":
      await removeEmployee();
      init();
      break;
    case "Remove Role":
      await removeRole();
      init();
      break;
    case "Remove Department":
      await removeDepartment();
      init();
      break;
    case "View total budget of department":
      await viewBudget();
      break;
    default:
      process.exit(0);
  }
};

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
};

async function viewBudget() {
    const depsArray = await getDepsInArray();
  
    const { department } = await prompt({
      name: "department",
      type: "list",
      message: "What department would you like to chose?",
      choices: depsArray.map((depart) => ({
        name: depart.name,
        value: depart.id,
      })),
    });
  
    const query = `SELECT SUM(salary) AS utilized_budget, name AS department_name
    FROM role
    INNER JOIN employee ON  role.id = employee.role_id
    INNER JOIN department ON role.department_id = department.id
    WHERE role.department_id = ?`;
  
    const data = await connection.query(query, [department]);
    console.table(data);
    init();
  }

