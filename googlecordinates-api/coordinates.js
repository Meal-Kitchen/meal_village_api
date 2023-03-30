const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const Joi = require('joi');

var bodyParser = require('body-parser');

app.use(bodyParser.json({type:'application'}));
app.use(bodyParser.urlencoded({extended:true}));

var connect = mysql.createConnection({
  host:'23.251.145.201',
  user:'karthykeya',
  password:'C0mpl3x1',
  database:'mvstagedb',
  port:'3306',
});

var server = app.listen(5000, function(){
  var host = server.address().address
  var port = server.address().port
});

connect.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database');
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/coordinates', function(req, res) {
  connect.query(
    "SELECT DISTINCT t.EMPLOYEEID, t.LATITUDE, t.LONGITUDE, DATE_FORMAT(t.INSERTEDDATECST, '%Y-%m-%d %H:%i:%s') AS INSERTEDDATECST_CST " +
    "FROM ( " +
    "  SELECT EMPLOYEEID, MAX(INSERTEDDATECST) AS MAX_INSERTEDDATECST " +
    "  FROM GPSCOORDINATES " +
    "  GROUP BY EMPLOYEEID " +
    ") AS m " +
    "JOIN GPSCOORDINATES  AS t " +
    "ON t.EMPLOYEEID = m.EMPLOYEEID AND t.INSERTEDDATECST = m.MAX_INSERTEDDATECST",
    function(err, results, fields) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        const data = results.map(row => {
          return {
            EMPLOYEEID: row.EMPLOYEEID,
            LATITUDE: row.LATITUDE,
            LONGITUDE: row.LONGITUDE,
            INSERTEDDATECST: row.INSERTEDDATECST_CST,
          };
        });
        res.send(data);
      }
    }
  );
});

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
