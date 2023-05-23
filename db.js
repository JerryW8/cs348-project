const mysql = require("mysql")


let db_conn = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: ''
});


db_conn.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Database");
    }
});
  
module.exports = db_conn;
