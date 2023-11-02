var mysql = require('mysql2')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nguyenviet@nh02',
  database: 'app'
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})