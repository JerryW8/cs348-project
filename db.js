const mysql = require("mysql")

// INITIAL DATABASE SETUP

let db_conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'cs348cs348'
});

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

// TABLE CREATION, IF THEY DON'T ALREADY EXIST

let create_table_query = [
  'Media(titleID VARCHAR(100) NOT NULL, originalTitle VARCHAR(100), startYear DATE, rating DOUBLE(2,1), numVotes INT, PRIMARY KEY (titleID))',
  
  'Crew(crewID VARCHAR (100) NOT NULL, name VARCHAR (100), role VARCHAR (100))',
  'Produced(crewID VARCHAR (100) NOT NULL REFERENCES Crew(crewID), titleID VARCHAR (100) NOT NULL REFERENCES Media(titleID))',
  
  'Cast(castID VARCHAR (100) NOT NULL, name VARCHAR (100) NOT NULL, character VARCHAR (100))',
  'PlaysIn(castID VARCHAR (100) NOT NULL REFERENCES Cast(castID), titleID VARCHAR (100) NOT NULL REFERENCES Media(titleID))',

  'Collection(collectionID VARCHAR (100) NOT NULL, notes VARCHAR (1000), isWatched BOOL, rating DOUBLE(2,1))',
  'HasNotes(titleID VARCHAR (100) NOT NULL REFERENCES Media(titleID), collectionID VARCHAR (100) NOT NULL REFERENCES Collection(collectionID))',
]
for (query of create_table_query) {
  db_conn.query("CREATE TABLE " + query, (error) => {
    if(error) throw error;
    console.log("Created Table " + query);
  });
}

// SAMPLE DATA INSERTION, IF THEY DON'T ALREADY EXIST

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