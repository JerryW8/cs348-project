const mysql = require("mysql")


let db_conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'cs348cs348'
});

// Movie (title, rating, release)

db_conn.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Database");
    }
});

let db_name = 'projectdb'
let create_query = `CREATE DATABASE IF NOT EXISTS ${db_name}`;

db_conn.query(create_query)

let useQuery = `USE ${db_name}`;
db_conn.query(useQuery);

let create_table_query = 'CREATE TABLE IF NOT EXISTS Movie(title VARCHAR(100) NOT NULL, rating DOUBLE(2,1) NOT NULL, release_date DATE NOT NULL);'
db_conn.query(create_table_query, (error) => {
  if(error) throw error;
  console.log("Created Table");
});

db_conn.query("INSERT INTO Movie VALUES('ABC', 7.8, '2023-03-04');")
db_conn.query("INSERT INTO Movie VALUES('DEF', 8.1, '2022-01-15');")
db_conn.query("INSERT INTO Movie VALUES('XYZ', 9.9, '2020-06-30');")

db_conn.query("SELECT * FROM Movie;", (error, results, fields) => {
  console.log(results);
})

db_conn.end()
  
/*
db_conn.query(create_query, (err) => {
    if(err) throw err;

    console.log("Database Created Successfully!");

     let use_query = `USE ${db_name}`;
    db_conn.query(use_query, (error) => {
        if(error) throw error;

        console.log("Using Database");
    });

    let create_table_query = 'CREATE TABLE IF NOT EXISTS Movie(title VARCHAR(100) NOT NULL, rating DOUBLE(2,1) NOT NULL, release_date DATE NOT NULL);'
    db_conn.query(create_table_query, (error) => {
      if(error) throw error;
      console.log("Created Table");
    });

    db_conn.query("INSERT INTO Movie VALUES('ABC', 7.8, '2023-03-04');")
    db_conn.query("INSERT INTO Movie VALUES('DEF', 8.1, '2022-01-15');")
    db_conn.query("INSERT INTO Movie VALUES('XYZ', 9.9, '2020-06-30');")
    
    // console.log(db_conn.query("SELECT * FROM Movie;"))
});
  
module.exports = db_conn;
*/