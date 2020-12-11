const { prompt } = require("inquirer");
const connection = require("../db");
const { getDepsInArray } = require("./methods.js");


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
  
    const data = await connection.query(query);
    console.table(data);
    
  }
  
  async function viewByDepart() {
    const depsArray = await getDepsInArray();
  
    const { department }= await prompt({
      name: "department",
      message: "What department would you like to chose?",
      choices: depsArray.map((depsItem) => ({
        name: depsItem.name,
        value: depsItem.id,
      })),
      type: "list",
    });
    
  console.log(department);
    const query = `SELECT first_name, last_name, title, salary
      FROM employee 
      INNER JOIN role ON employee.role_id = role.id 
      INNER JOIN department ON role.department_id= department.id 
      WHERE department.id = ?`;
  
    const data = await connection.query(query, [department]);
    console.table(data);
    
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
  
    const data = await connection.query(query, manID);
    console.table(data);
    
  }
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
  
    const data = await connection.query(query);
    console.table(data);
 
  }

  module.exports = {
      viewAllEmp,
      viewByDepart,
      viewByManager,
      viewAllDep,
      viewAllRoles
  }