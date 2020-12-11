// // Variables for functions, methods, packages
const { prompt } = require("inquirer");
const connection = require("../db");
const { getDepsInArray, getRolesInArray, getEmpsInArray } = require("./methods.js");


// Remove employees function
async function removeEmployee() {
  // Methods
    const empsInArray = await getEmpsInArray();
    // Prompt
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
  // Send request to database
    const data = await connection.query(query, [empName]);
    console.log("Employee deleted!");
   
  }

  // Remove roles function 
  async function removeRole() {
    // Methods
    const rolesInArray = await getRolesInArray();
    // Prompts
    const { role } = await prompt([
      {
        name: "role",
        type: "list",
        choices: rolesInArray.map((role) => ({
          name: role.title,
          value: role.id,
        })),
        message: "What role do you want to remove?",
      },
    ]);
  
    const query = `DELETE FROM role WHERE id = ?`;
  // Send request to database
    const data = await connection.query(query, [role]);
    console.log("Role deleted!");
    
  }

  // Remove departments
  async function removeDepartment() {
    // Methods
      const depsInArray = await getDepsInArray();
      // Prompts
      const { department } = await prompt([
        {
          name: "department",
          type: "list",
          choices: depsInArray.map((depart) => ({
            name: depart.name,
            value: depart.id,
          })),
          message: "What role do you want to remove?",
        },
      ]);
    
      const query = `DELETE FROM department WHERE id = ?`;
    // Send request to database
      const data = await connection.query(query, [department]);
      console.log("Department deleted!");
    
    };

// Export functions
    module.exports = {
        removeEmployee,
        removeRole,
        removeDepartment,
    };