const mysql = require("mysql")


let db_conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ''
});


db_conn.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Database");
    }
});

let db_name = 'helloworld'
let create_query = `CREATE DATABASE IF NOT EXISTS ${db_name}`;

db_conn.query(create_query, (err) => {
    if(err) throw err;

    console.log("Database Created Successfully!");

     let use_query = `USE ${db_name}`;
    db_conn.query(use_query, (error) => {
        if(error) throw error;

        console.log("Using Database");
    });

    let create_table_query = 'CREATE TABLE IF NOT EXISTS CALENDAR(MONTHS DATE NOT NULL);'
    db_conn.query(create_table_query, (error) => {
      if(error) throw error;
      console.log("Created Table");
    });

    db_conn.query("INSERT INTO CALENDAR(MONTHS) VALUES('2023-01-01');")
    db_conn.query("INSERT INTO CALENDAR(MONTHS) VALUES('2023-02-01');")
    db_conn.query("INSERT INTO CALENDAR(MONTHS) VALUES('2023-03-01');")
    
    console.log(db_conn.query("SELECT * FROM CALENDAR;"))
});
  
module.exports = db_conn;
