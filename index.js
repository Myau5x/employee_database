const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
  password: "y8D8P&bSu",
    database: "top_songsDB"
  });

  const questions = [        
    {
      type: "list",
      choices: ['song by artist','artist more then once','song in range','specific song','exit'],
      message: "What to do?",
      name: "action"
    },
];

function askArtist(){
    inquirer
    .prompt([{
        type: 'input',
        message: 'What artist?',
        name: 'artist'
    }])
    .then((response)=>{
        selectArtist(response.artist);
    });
}
function askSong(){
    inquirer
    .prompt([{
        type: 'input',
        message: 'What song?',
        name: 'song'
    }])
    .then((response)=>{
        selectSong(response.song);
    });
}

const rangeQ = [
    {
        type: 'input',
        message: "start position?",
        name: 'start'
    },
    {
        type: 'input',
        message: "end position?",
        name: 'end'
    },
]
function askRange(){
    inquirer.prompt(rangeQ)
    .then((response)=>{
        selectRange(response.start,response.end)});
}

function selectRange(start, end){
    connection.query(`SELECT * FROM top5000 WHERE id >= '${start}' and id <= '${end}'`, (err,res)=>{
        if(err) {
            console.log(err);
          } else {
            console.log(res);
            askDo();
          } 
    })
}

function selectArtist(artist){
    connection.query(`SELECT * FROM top5000 WHERE artist = '${artist}'`, (err,res)=>{
        if(err) {
            console.log(err);
          } else {
            console.log(res);
            askDo();
          } 
    })
}

function selectSong(song){
    connection.query(`SELECT * FROM top5000 WHERE song = '${song}'`, (err,res)=>{
        if(err) {
            console.log(err);
          } else {
            console.log(res);
            askDo();
          } 
    })
}


function selectTwice(){
    connection.query(`SELECT artist, count(song) as c FROM top5000 GROUP BY artist HAVING c > 1`, (err,res)=>{
        if(err) {
            console.log(err);
          } else {
            console.log(res);
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
            case questions[0].choices[0]: ///specific artist
              // code block
              console.log(0)
              //askDo()
              askArtist();
              break;
            case questions[0].choices[1]: /// more then two times
              // code block
              console.log(1);
              selectTwice();
              break;
            case questions[0].choices[2]: // song in range
                // code block
                console.log(2)
                askRange();
                break;
            case questions[0].choices[3]: /// specific song
              // code block
              console.log(3)
              askSong();
              break;
            case questions[0].choices[4]: //exit
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
    askDo();

  });