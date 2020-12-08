const { prompt } = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employeeTracker_DB",
});

connection.connect(() => {
  console.log("Welcome to Employee Tracker!");
  // Start my app
//   postOrBid();
});
