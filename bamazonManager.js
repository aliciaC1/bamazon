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
  managerOpts();
});


function managerOpts() {
    inquirer.prompt([
        {
            name: "managerOption", 
            type: "rawlist", 
            message: 'Please select an option below:', 
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"], 
        }, 
    ]). then (function (answer){
        switch(answer.managerOption) {
            case "View Products": 
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory(); 
                break;
            case "Add to Inventory": 
                addInventory(); 
                break; 
            case "Add New Product": 
                addProduct(); 
                break; 
            case "Exit": 
                connection.end(); 
                break;
        }
    }); 
}
  function viewProducts() {
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
      managerOpts();
    });
  
    
  }

  function lowInventory() {
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
        if(res[i].stock_quantity < 100) {
          
      rows.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
      
       } 
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
     

      if(rows.length > 0) {
        console.log("\nThe following products are low on inventory. (Stock Quantity is less than 100) ");	
        console.log(str1);		
    } else {
        console.log("\nThere are no low quantity products right now!\n");
    }
    
      managerOpts();
    });
  }

  function addInventory() {

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
      inquirer.prompt([{
        name: "selectProd",
        type: "input", 
        message: "Please enter the ID # of the product to add inventory to:", 
        validate: (value) => {
          if (!isNaN(value) && (value > 0 && value <= 14)) {
            return true; 
          }else {
            console.log(chalk.redBright.bold(' => Please enter an ID # from list above.') + emoji.emojify(':exclamation:')); 
            return false;
          }
        }
    }, {
        name: "quantity",
        type: "input",
        message: "Please enter quantity you'd like to add:", 
        validate: (value) => {
          if (!isNaN(value) && value > 0) {
            return true; 
          }else {
            console.log(chalk.redBright.bold(' => Please enter a number greater than 0.')+ emoji.emojify(':exclamation:')); 
            return false;
          }
        }
      }
    ]).then(function (answer) {
        updateQty = parseInt(res[answer.selectProd -1].stock_quantity) + parseInt(answer.quantity); 
        connection.query("UPDATE products SET ? WHERE ? ", [{
            stock_quantity: updateQty
        }, {
            id: answer.selectProd
        }], function(err, res) {
            if (err) throw err;
            console.log("\n Quantity has been updated. Updated stock quantity : " + updateQty  + "\n");
            managerOpts();
        })
    })
     
    });

  }

  function addProduct(){
    inquirer.prompt([
        {
            name: "newName",
            type: "input",
            message: "New Product Name:"
        },
        {
            name: "newDept",
            type: "input",
            message: "New Product Department:",
            
        },
        {
            name: "newPrice",
            type: "number",
            message: "New Product Price:",
            validate: (value) => {
                if (!isNaN(value) && value > 0) {
                  return true; 
                }else {
                  console.log(chalk.redBright.bold(' => Please enter a number greater than 0.')+ emoji.emojify(':exclamation:')); 
                  return false;
                }
              }
            
        },
        {
            name: "newQty",
            type: "number",
            message: "New Product Stock Quantity:", 
            validate: (value) => {
                if (!isNaN(value) && value > 0) {
                  return true; 
                }else {
                  console.log(chalk.redBright.bold(' => Please enter a number greater than 0.')+ emoji.emojify(':exclamation:')); 
                  return false;
                }
              }
        },
        ]).then(function (answer) {
            connection.query("INSERT INTO products SET ?", {
                product_name: answer.newName,
                department_name: answer.newDept,
                price: answer.newPrice,
                stock_quantity: answer.newQty
            }, function(err, res) {
                if(err) throw err;
                console.log("\n" + "Stock quanity of " + answer.newQty +" for " + answer.newName + " has been added to " + answer.newDept + " department inventory.\n");
                managerOpts();
            });
        });
  }
