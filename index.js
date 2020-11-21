const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "y8D8P&bSu", ///add dotenv and hide pasword
    database: "employeeDB" // 
  });

const questions = [{
  type: "list",
  choices: ['Add department','Add role','Add employee','View departments','View roles', 'View employees','Update employee role','Exit'],
  message: "What to do?",
  name: "action"
}]

function selectDep(){
  connection.query(`SELECT * FROM departments`, (err,res)=>{
      if(err) {
          console.log(err);
        } else {
          const table = cTable.getTable(res)
          console.log(table);
          askDo();
        } 
  })
}


function askDo() {
    //console.log("goods")
    inquirer
    .prompt(questions)
    .then((response) => {
        console.log(response.action);
        switch(response.action) {
            case questions[0].choices[0]: ///Add dep
              // code block
              console.log(0);
              askDo();
              
              break;
            case questions[0].choices[1]: /// Add role
              // code block
              console.log(1);
              askDo();
              break;
            case questions[0].choices[2]: // Add EE
                // code block
                console.log(2);
                askDo();
                break;
            case questions[0].choices[3]: /// View Departments
              // code block
              console.log(3)
              selectDep();
              break;
            case questions[0].choices[4]: /// View Roles
              // code block
              console.log(4)
              askDo();
              break;
            case questions[0].choices[5]: /// View EE
              // code block
              console.log(5)
              askDo();
              break;
            case questions[0].choices[6]: /// Update Role
              // code block
              console.log(3)
              askDo();
              break;
              
            case questions[0].choices[7]: //exit
              // code block
              console.log(4)
              connection.end();
              break;
              
            default:
                break
              // code block
          }
  
      }
    );
  
  }


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    //console.log(questions);
    askDo()

  });