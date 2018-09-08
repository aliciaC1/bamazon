// var connection = sql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   password : 'password',
//   database : 'bamazonDB'
// });



 
// var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');
var Table = require('tty-table');
var chalk = require('chalk');
var sql = require("mssql");
var tedious = require("tedious");


var config = {
  user: 'sa',
  password: 'marGiela1!',
  server: 'localhost', 
  database: 'bamazonDB', 
  dialect: 'mssql',
  options: {
    encrypt: false
  }
};


sql.connect(config, function(err) {
  if (err) throw err;
  console.log("connected as id " + config.threadId);
  afterConnection();
});

function afterConnection() {
  console.log(figlet.textSync(' BAMAZON', {
    font: 'isometric2',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));
  var request = new sql.Request();
  var query = "SELECT * FROM products"
  request.query(query, function(err, res) {
    if (err) throw err;
    // console.log(res);
    var header = [
      {
        value : "ID#",
        headerColor : "cyan",
        color: "redBright",
        align : "center",
        width : 6
      },
      {
        value : "PRODUCT",
        headerColor : "cyan",
        color: "white",
        align : "center",
        width : "default"
      },
      {
        value : "DEPARTMENT",
        headerColor : "cyan",
        color: "white",
        align : "left",
        width : 30
      },
      {
        value : "Price",
        color : "red", 
        width : 10,
        formatter : function(value){
          var str = "$" + value.toFixed(2);
          if(value > 0){
            str = chalk.green(str);
          }
          return str;
        }
      },
      {
        value : "QTY",
        width : 15,
        formatter : function(value){
          
          //will convert an empty string to 0  
          //value = value * 1;
          
          if(value > 0) {
            value = chalk.black.bgYellow(value);
          }
          else{
            value = chalk.white.bgRed(value);
          }
          return value;
        }
      }
    ];
    var rows = []; 
    for (var i = 0; i < res.length; i++) {
    rows.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
     }

    var t1 = Table(header,rows,{
      borderStyle : 1,
      borderColor : "blue",
      paddingBottom : 0,
      headerAlign : "center",
      align : "center",
      color : "white",
      truncate: "..."
    });

    str1 = t1.render();
    console.log(str1);
    userPrompt(); 
    connection.end();

  });

  
}



function userPrompt() {
  inquirer
    .prompt([
    {
      name: "purchaseItem",
      type: "input",
      message: "What is the ID# of the product you would like to purchase?",
    }, 
    {
      name: "purchaseQty",
      type: "input",
      message: "How many units would you like to purchase?",
    }
  ])
  .then(function(answer) {
    connection.query("SELECT * FROM products WHERE ?", {id: answer.purchaseItem}, function(err, res) {
      if (answer.purchaseQty > res.stock_quantity){

      } else {
        console.log("Sorry, there is insufficent stock left for your desired quantity.")
      }
    })
  })

  }
