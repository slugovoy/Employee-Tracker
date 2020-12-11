// Variables for functions, methods, packages
const { prompt } = require("inquirer");
const connection = require("../db");
const { getDepsInArray } = require("./methods.js");

// View all employees
async function viewAllEmp() {
    const query =
      `SELECT  e.first_name, e.last_name,
      role.title, role.salary, department.name,
      IFNULL(CONCAT(m.first_name, ' ', m.last_name),'no manager') AS 'Manager'
      FROM employee e
      LEFT JOIN employee m ON m.id = e.manager_id
      INNER JOIN role ON e.role_id = role.id

      INNER JOIN department ON role.department_id = department.id
      ORDER BY manager DESC;`;
  

    // Send request to database
    const data = await connection.query(query);
    console.table(data);
    
  }
  // View employees by department
  async function viewByDepart() {
    const depsArray = await getDepsInArray();
  // Prompts
    const { department }= await prompt({
      name: "department",
      message: "What department would you like to chose?",
      choices: depsArray.map((depsItem) => ({
        name: depsItem.name,
        value: depsItem.id,
      })),
      type: "list",
    });
  
    const query = `SELECT first_name, last_name, title, salary
      FROM employee 
      INNER JOIN role ON employee.role_id = role.id 
      INNER JOIN department ON role.department_id= department.id 
      WHERE department.id = ?`;
  

      // Send request to database
    const data = await connection.query(query, [department]);
    console.table(data);
    
  }

  // Function to view employees by manager
  async function viewByManager() {

    // Prompts
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
  // Send request to database
    const data = await connection.query(query, manID);
    console.table(data);
    
  }

  // View all departments
  async function viewAllDep() {
    const query = "SELECT name FROM department";
  
    const data = await connection.query(query);
    console.table(data);
    
  }
  async function viewAllRoles() {
    const depsArray = await getDepsInArray();
    const query = `SELECT title, salary, name AS department_name FROM role
    INNER JOIN department
    ON role.department_id = department.id
    ORDER BY name ASC`;
    // Send request to database
    const data = await connection.query(query);
    console.table(data);
 
  }
// Export functions
  module.exports = {
      viewAllEmp,
      viewByDepart,
      viewByManager,
      viewAllDep,
      viewAllRoles
  }