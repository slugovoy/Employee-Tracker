const { prompt } = require("inquirer");
const connection = require("../db");
const { getDepsInArray, getRolesInArray, getEmpsInArray } = require("./methods.js");

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
   
  }
  async function removeRole() {
    const rolesInArray = await getRolesInArray();
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
  
    const data = await connection.query(query, [role]);
    console.log("Role deleted!");
    
  }
  async function removeDepartment() {
      const depsInArray = await getDepsInArray();
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
    
      const data = await connection.query(query, [department]);
      console.log("Department deleted!");
    
    };


    module.exports = {
        removeEmployee,
        removeRole,
        removeDepartment,
    };