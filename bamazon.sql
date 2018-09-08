DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NULL,
  department_name VARCHAR(200) NULL, 
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Play-Doh 10-Pack Case of Colors","Toys & Games",  7.99, 490), 
       ("Mattel Games Uno Card Game","Toys & Games",  5.99, 180), 
       ("Fijifilm INSTAX Mini Instant Film Twin Pack (White)","Camera & Photos",  12.60, 270), 
       ("Echo Dot (2nd Generation) - Smart Speaker with Alexa - Black","Electronics",  49.99, 120), 
       ("Roku Express","Electronics", 29.88, 170), 
       ("$20 PlayStation Store Gift Card [Digital Code]","Video Games", 20.00, 200), 
       ("Super Mario Party Nintendo","Video Games",  59.99, 120), 
       ("Super NES Classic Nintendo","Video Games",  79.96, 80), 
       ("Levis Men's 501 Original-Fit Jean","Clothing, Shoes & Jewelry",  23.12, 320), 
       ("Gildan Men's White Crew T-Shirt Multipack","Clothing, Shoes & Jewelry",  10.17, 500), 
       ;

