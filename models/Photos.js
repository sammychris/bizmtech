const db = require('./db');

//Task object constructor
var Photos = function(photo){
    this.filename = photo.filename;
    this.product_id = photo.product_id;
    this.ismain = photo.ismain
};

Photos.upload = function (photos, result) {
    db.getConnection((err, connection) => {
        if (err) throw err; 
        connection.query("insert into `photos` (`filename`, `product_id`) values ?", [photos], function (err, res) {    
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

Photos.getByProductId = function (product_id, result) {
    db.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("Select * from photos where product_id = ? ", product_id, function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                result(null, res);
            }
            connection.release();
        });
    });  
};

Photos.getAll = function (result) {
    db.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("Select * from photos", function (err, res) {
            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
            	console.log('photos : ', res);  
            	result(null, res);
            }
            connection.release();
        });
    });
};

Photos.updateById = function(id, Photos, result){
    db.getConnection((err, connection) => {
        if (err) throw err;
    	connection.query("UPDATE photos SET ? WHERE id = ?", [Photos, id], function (err, res) {
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

Photos.remove = function(id, result){
    db.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("DELETE FROM photos WHERE id = ?", [id], function (err, res) {
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

module.exports = Photos;
