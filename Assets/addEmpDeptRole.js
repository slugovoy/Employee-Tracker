// Variables for functions, methods, packages
const { prompt } = require("inquirer");
const connection = require("../db");
const { getDepsInArray, getRolesInArray, getEmpsInArray } = require("./methods.js");

// Add employee
async function addEmployee() {
  // Methods
    const rolesArray = await getRolesInArray();
    const empsInArray = await getEmpsInArray();
    //Prompts
    const { first_name, last_name, role, manager } = await prompt([
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
      {
          type: "list",
          name: "manager",
          message: "Who will be the employee manager?",
          choices: empsInArray.map((employee) => ({
            name: employee.name,
            value: employee.id,
      })),
    },
    ]);
    console.log(role);
  // Send request to database
    const query1 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?,?)`;
    const data1 = await connection.query(query1, [first_name, last_name, role, manager]);
  
    console.log("New employee was added!");
  
    
  }
  
  // Add department
  async function addDepartment() {
    // Prompt
    const { department } = await prompt({
      name: "department",
      message: "What department would you like to add?",
      type: "input",
    });
  
    const query = `INSERT INTO department (name) VALUES (?)`;
  // Send request to database
    const data = await connection.query(query, [department]);
    console.log("New department added!");
    
  }

  // Add role
  async function addRole() {
    // Methods
    const depsArray = await getDepsInArray();
    // Prompts
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
  // Send request to database
    const data = await connection.query(query, [title, salary, belongsTo]);
    console.log("New role added!");
   
  }

  // Exports functions
  module.exports = {
      addEmployee,
      addDepartment,
      addRole,
  }