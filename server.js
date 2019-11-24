require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// serving static files...
app.use('/uploads', express.static('uploads'));
if (isProduction) app.use(express.static('build'));


// import your route
require('./route/api')(app);


//serving all js data
if (isProduction) {
	app.get('/*', function(req, res) {
	  res.sendFile(path.join(__dirname, './build/index.html'), function(err) {
	    if (err) {
	      res.status(500).send(err)
	    }
	  })
	});
}


const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
