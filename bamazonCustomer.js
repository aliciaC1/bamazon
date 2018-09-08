var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');
var Table = require('tty-table');
var chalk = require('chalk');
var emoji = require('node-emoji'); 


var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'password',
  database : 'bamazonDB'
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  console.log(figlet.textSync(' BAMAZON', {
    font: 'isometric2',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));
  var query = "SELECT * FROM products"
  connection.query(query, function(err, res) {
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
    // connection.end();

  });

  
}



function userPrompt() {
  // prompts user for id and quantity of product they want to purchase
  inquirer.prompt([{
      name: "selectProd",
      type: "input", 
      message: "Please enter the ID # of the product you would like to purchase.", 
      validate: (value) => {
        if (!isNaN(value) && (value > 0 && value <= 10)) {
          return true; 
        }else {
          console.log(chalk.redBright.bold(' => Please enter an ID # from list above.') + emoji.emojify(':exclamation:')); 
          return false;
        }
      }
  }, {
      name: "quantity",
      type: "input",
      message: "How many of the product you selected would you like to buy?", 
      validate: (value) => {
        if (!isNaN(value) && value > 0) {
          return true; 
        }else {
          console.log(chalk.redBright.bold(' => Please enter a number greater than 0.')+ emoji.emojify(':exclamation:')); 
          return false;
        }
      }
    }
  ]).then(function(answers) {
      // selects quantity of item user specified in prompt above
      connection.query("SELECT stock_quantity FROM products WHERE id = ?", [answers.selectProd], function(err, res) {
          // there is not enough in stock to fulfill purchase
          if (answers.quantity > res[0].stock_quantity) {
            console.log(emoji.emojify('\n:grey_exclamation:') + chalk.redBright.bold(" Sorry, there is insufficent stock left for your desired quantity. ")+emoji.emojify(':white_frowning_face:\n')); 
            inquirer.prompt({
              name:'confirmP',
              type: 'confirm', 
              message: 'Are you still interested in this product?'
            }).then ((answer) => {
              if (answer.confirmP) {
                userPrompt();
              } else{
                connection.end(); 
                console.log(chalk.white.bold('\nThanks for shopping at Bamazon! Come again! ')+emoji.emojify(':grinning:\n')); 
              }
            }); 
          } else {
              // there is enough in stock to fulfill purchase
              orderProcess();
              function orderProcess(){

              console.log(chalk.yellow ('Processing your order...')); 
              var newQty = res[0].stock_quantity - answers.quantity;
              
              connection.query("SELECT * FROM products WHERE id = ?", [answers.selectProd], function(err, res) {
                 
                  var prodSelected = res[0].product_name;
                  var price = res[0].price;
                  var department = res[0].department_name;
                  var total = parseFloat(price * answers.quantity);
                   // var prodSales = parseFloat(res[0].product_sales);
                  // new product sales figure is old product sales plus new sales
                  // var newProdSales = prodSales + total;
                  //update departments table with new product sales
                  // connection.query("SELECT total_sales FROM departments WHERE department_name = ?", [department], function(err, res) {
                  //     // represents previous department sales
                  //     // var dptSales = parseFloat(res[0].total_sales);
                  //     // adds new sale to previous department sales
                  //     var newDptSales = dptSales + total;
                  //     // updates total sales
                  //     connection.query("UPDATE departments SET ? WHERE ?", [{
                  //         total_sales: newDptSales
                  //     }, {
                  //         department_name: department
                  //     }], function(err, res) {
                  //         if (err) throw err;
                  //     });
                  // });
                  // update product table with new quantity and product sales
                  connection.query("UPDATE products SET ? WHERE ?", [{
                      stock_quantity: newQty,
                      // product_sales: newProdSales
                  }, {
                      id: answers.selectProd
                  }], function(err, res) {
                      if (err) throw err;
                      // let user know of their success in purchasing their items
                      
                      console.log( emoji.emojify("\n :ballot_box_with_check:") + "  Order Confirmed! You've purchased " + answers.quantity + " of " + prodSelected + " for the price of $" + total.toFixed(2) + ".\n");
                      // restarts function to buy items
                      anotherOrder(); 
                  
                  });
              });
          }
        }
      });
  });
}


var anotherOrder = function () {
  inquirer.prompt({
    name: 'newPurchase', 
    type: 'confirm', 
    message: 'Would you like to make another purchase?'
  }). then (function (answer)  {
    if (answer.newPurchase) {
      afterConnection();
    } else {
      console.log(chalk.white.bold('\nThanks for your business. Have a great day! ')+emoji.emojify(':grinning:')); 
      connection.end();
    }
  }); 
}


