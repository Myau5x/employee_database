const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

require("dotenv").config();


const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: process.env.DB_USER,
  
    // Your password
    password: process.env.DB_PASS, ///add dotenv and hide pasword
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

function insRole(response,dep_id){
  let query = "INSERT INTO roles SET ?"
  connection.query(query,{
    title: response.title,
    salary: response.salary,
    department_id: dep_id
  },(err)=>{
    if(err){
      console.log(err);
    }
    else {
      askDo();
    }
  })
}


function insEE(response,role_id){
  let query = "INSERT INTO employees SET ?"
  if (response.manager === 'Null'  ){
    connection.query(query,{
      first_name: response.fname,
      last_name: response.lname,
      role_id: role_id
    },(err)=>{
      if (err){ console.log(err)}
      else{
        askDo()
      }
    })
  }
  else{
    let man_id = parseInt (response.manager.split(' ')[0]);
    connection.query(query,{
      first_name: response.fname,
      last_name: response.lname,
      role_id: role_id,
      manager_id: man_id
    },(err)=>{
      if (err){ console.log(err)}
      else{
        askDo()
      }
    })
  }
}

function updEE(response,role_id){
  let query = "UPDATE employees SET ? WHERE ?"
  let ee_id = parseInt (response.ee.split(' ')[0]);
  connection.query(query,[
    {
      role_id: role_id},
      {id: ee_id
    }],(err)=>{
      if (err){ console.log(err)}
      else{
        askDo()
      }
    })
}


function updateRole(){
  connection.query("SELECT * from roles",(err,resRoles)=>{
    if(err){
      console.log(err);
    }
    else{
      connection.query("SELECT * from employees",(err,resEE)=>{
        if(err){
          console.log(err);
        }
        else{
          let roles = []
          for (var i=0;i<resRoles.length;i++){
            roles.push(resRoles[i].title);
          }
          //console.log(resEE);
          let managers = []
          for (var i=0;i<resEE.length;i++){
            managers.push( `${resEE[i].id} ${resEE[i].first_name} ${resEE[i].last_name}`);
          }
          const questionsEE = [
            {
              type: "rawlist",
              choices: managers,
              message: "Choose Employee",
              name: "ee"
            },
          {
            type: "list",
            choices: roles,
            message: "Choose role",
            name: "role"
          },
          
          ];
          inquirer.prompt(questionsEE).then((response)=>{
            //console.log(response.manager);
            let chosenItem;
            for (var i = 0; i < resRoles.length; i++) {
              if (resRoles[i].title === response.role) {
                chosenItem = resRoles[i];
              }
            }
            updEE(response,chosenItem.id);

            //askDo(); ///later we change to insert EE and add logic about role and manager
          })
        }
      })
    }
  })
}


function askEE(){
  connection.query("SELECT * from roles",(err,resRoles)=>{
    if(err){
      console.log(err);
    }
    else{
      connection.query("SELECT * from employees",(err,resEE)=>{
        if(err){
          console.log(err);
        }
        else{
          let roles = []
          for (var i=0;i<resRoles.length;i++){
            roles.push(resRoles[i].title);
          }
          //console.log(resEE);
          let managers = ["Null"]
          for (var i=0;i<resEE.length;i++){
            managers.push( `${resEE[i].id} ${resEE[i].first_name} ${resEE[i].last_name}`);
          }
          const questionsEE = [{
            type: "input",
            message: "Enter First Name",
            name: "fname"
          },
          {
            type: "input",
            message: "Enter Last Name",
            name: "lname"
          },
          {
            type: "list",
            choices: roles,
            message: "Choose role",
            name: "role"
          },
          {
            type: "rawlist",
            choices: managers,
            message: "Choose manager",
            name: "manager"
          }
          ];
          inquirer.prompt(questionsEE).then((response)=>{
            //console.log(response.manager);
            let chosenItem;
            for (var i = 0; i < resRoles.length; i++) {
              if (resRoles[i].title === response.role) {
                chosenItem = resRoles[i];
              }
            }
            insEE(response,chosenItem.id);

            //askDo(); ///later we change to insert EE and add logic about role and manager
          })
        }
      })
    }
  })
}


function askRole(){
  connection.query("SELECT * from departments",(err,res)=>{
    if(err){
      console.log(err);
    } else { 
      ///Ask title, ask salary , create department and ask departmnet
      let deps = []
      for (var i =0; i<res.length;i++){
        deps.push(res[i].name);
      }
      const questionsRole = [{
        type: "input",
        message: "Enter role title?",
        name: "title"
      },
      {
        type: "input",
        message: "Enter role salary",
        name: "salary"
      },
      {
        type: "list",
        choices: deps,
        message: "Choose department",
        name: "department"
      }];
      inquirer.prompt(questionsRole).then((response)=>{
        console.log(response.title);
        /// find dep id
        let dep_id = 0;
        let chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].name === response.department) {
            chosenItem = res[i];
          }
        }
        dep_id = chosenItem.id;
        insRole(response,dep_id);
      })
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
        //console.log(response.action);
        let qu = "";
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
              //console.log(2);
              askEE();
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
              qu = `SELECT e.id, e.first_name, e.last_name, title, salary, name, CONCAT(m.first_name,' ',m.last_name) as Manager FROM employees as e
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
              //console.log(6)
              updateRole();
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