var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'testdb'
});

connection.connect()
var a={"8:30":'longbell'};
var s=JSON.stringify(a) ;
console.log(s);
var u="\'"+s+"\'";
console.log(u);
var p='INSERT INTO db1 VALUES ('+"\'"+s+"\'"+')';
console.log(p);
connection.query('SELECT * FROM db1 WHERE name='+u+'', function (err, rows, fields) {
if(err) console.log(err);
console.log("h"+rows[1].ok);
var d=JSON.parse(rows[1].name);
console.log(d["8:30"]);
  console.log('The solution is: ', rows[1].name)
})

connection.end()
