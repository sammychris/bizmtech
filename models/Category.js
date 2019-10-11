const db = require('./db');

//Task object constructor
var Category = function(cat){};

Category.createCategory = function (cat, result) {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("INSERT INTO category set ?", cat, function (err, res) {    
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
    })
};

Category.getAll = function (result) {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("SELECT * FROM category", function (err, res) {
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

Category.getProductByCat = function (cat_id, result) {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("select * from `products` where `category_id` = ? ", cat_id, function (err, res) {
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
    })
};


module.exports = Category;
