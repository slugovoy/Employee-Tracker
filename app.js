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
  whatToDo();
});

async function whatToDo() {
  const { whatToDo } = await prompt({
    name: "whatToDo",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "EXIT",
    ],
    type: "list",
  });

  if (whatToDo === "View All Employees") {
    viewAllEmp();}
   else if (whatToDo === "View All Employees By Department") {
    viewByDepart();
  } 
//   else if (whatToDo === "View All Employees By Manager") {
//     viewByManager();
//   } else if (whatToDo === "Add Employee") {
//     addEmployee();
//   } else if (whatToDo === "Remove Employee") {
//     viewByDepart();
//   } else if (whatToDo === "Update Employee Role") {
//     viewByDepart();
//   } else if (whatToDo === "Update Employee Manager") {
//     viewByDepart();
//   } 
  else {
    connection.end();
  }
}

function viewAllEmp() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if(err) throw err;
        console.table(res)
    } )
}
async function viewByDepart(){
    const {viewByDepart} = await prompt({
       name: "viewDepart",
       message: "What department would you like to chose?",
       choices: ["Sales", "Engineering", "Finance", "Legal"],
       type: "list"
    })

    
    connection.query("SELECT * FROM employee WHERE ?")
}
