// Connection
const connection = require("../db");

// Methods

// Get all departments
async function getDepsInArray() {
    const query = `SELECT name, id FROM department`;
    const data = await connection.query(query);
  
    return data;
  }
  
  // Get all roles
  async function getRolesInArray() {
    const query = `SELECT title, id FROM role`;
    const data = await connection.query(query);
  
    return data;
  }

  // Get all employees
  async function getEmpsInArray() {
    const query = `SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employee`;
    const data = await connection.query(query);
  
    return data;
  }
// Export methods
  module.exports = {
      getDepsInArray,
      getRolesInArray,
      getEmpsInArray,
  }