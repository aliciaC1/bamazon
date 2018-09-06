var mysql = require("mysql");

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'password',
  database : 'bamazonDB'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

// prompt user with two messages
//1. ask them ID of product like to buy 
// 2. how many units would like to buy 

// check to see if enough units to puchase 
// if not 'insufficient quantity'  / precent order 
 // if enough fulfill order and reflect remaining quanitty 
 // once order goes thorugh show customer total cost of purchase.  

