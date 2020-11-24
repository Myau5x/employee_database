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

function viewTable(query){
  connection.query(query, (err,res)=>{
      if(err) {
          console.log(err);
        } else {
          const table = cTable.getTable(res)
          console.log(table);
          askDo();
        } 
  })
}

function insDep(name){
  let query = "INSERT INTO departments SET ?"
  connection.query(query,{name:name},(err,res)=>{
    if(err){
      console.log(err);
    } else {
      askDo()
    }
  })
}

function askRole(){
  connection.query("SELECT * from departments",(err,res)=>{
    if(err){
      console.log(err);
    } else {
      askDo();
    }
  })
}

function askDep(){
  inquirer.
  prompt([{
    type: "input",
    message: "Enter department name",
    name: "name"
  }])
  .then((response)=>{
    console.log(response.name);
    insDep(response.name);
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
              //console.log(0); ///Ask Name, than insert

              askDep();
              
              break;
            case questions[0].choices[1]: /// Add role
              // code block // Ask title, ask salary , create department and ask departmnet, and then insert 
              //console.log(1);
              askRole();
              break;
            case questions[0].choices[2]: // Add EE
                // code block
                console.log(2);
                askDo();
                break;
            case questions[0].choices[3]: /// View Departments
              // code block
              //console.log(3)
              qu = "SELECT * from departments;"
              viewTable(qu);
              break;
            case questions[0].choices[4]: /// View Roles
              // code block
              qu = `SELECT roles.id, title, salary, name as department FROM roles
              LEFT JOIN departments 
              ON roles.department_id = departments.id;`;
              viewTable(qu);
              break;
            case questions[0].choices[5]: /// View EE
              // code block
              qu = `SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name as Manager_firstName, 
              m.last_name as Manager_lastName FROM employees as e
              LEFT JOIN employees as m
              ON e.manager_id = m.id
              LEFT JOIN roles
              ON e.role_id = roles.id
              LEFT JOIN departments 
              ON roles.department_id = departments.id;`
              viewTable(qu);
              break;
            case questions[0].choices[6]: /// Update Role
              // code block
              console.log(3)
              askDo();
              break;
              
            case questions[0].choices[7]: //exit
              // code block
              console.log('Bye');
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