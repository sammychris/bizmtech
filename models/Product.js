const db = require('./db');

//Task object constructor
var Product = function(product){
    this.make = product.make;
    this.model = product.model;
    this.year = product.year;
    this.category_id = product.category_id;
    this.name = product.name;
};

Product.createProduct = function (newProduct, result) {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("INSERT INTO products set ?", newProduct, function (err, res) {    
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                console.log(res.insertId);
                result(null, res.insertId);
            }
            connection.release();
        });
    });         
};

Product.getAll = function (cat_id, result) {
    const sql = cat_id
        ? "select * from `products` where `category_id` = '"+cat_id+"'"
        : "SELECT * FROM products";
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(sql, function (err, res) {
            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                //console.log('product : ', res);  
                result(null, res);
            }
            connection.release();
        });   
    });
};

Product.search = function (search, result) {
    const arrQ = search.split(/\s+/);
    let query = "select * from `products` where `q` like '%"+arrQ[0]+"%'";
    const limit = " LIMIT 10";
    if (arrQ.length > 1)
        for (let i = 1; i < arrQ.length; i++) {
            query += " AND `q` LIKE '%"+arrQ[i]+"%'"
        }
        
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(query+limit, function (err, res) {
            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                //console.log('product : ', res);  
                result(null, res);
            }
            connection.release();
        });
    }); 
};

Product.getById = function (productId, result) {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("Select * from products where id = ? ", productId, function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                result(null, res);
            }
            connection.release();
        });
    })   
};

Product.updateById = function(id, product, result){
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("UPDATE products SET ? WHERE id = ?", [product, id], function (err, res) {
            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                result(null, res);
            }
            connection.release();
        }); 
    });
};

Product.remove = function(id, result){
    db.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("DELETE FROM products WHERE id = ?", [id], function (err, res) {

            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
             result(null, res);
            }
            connection.release();
        });
    }); 
};

module.exports = Product;
