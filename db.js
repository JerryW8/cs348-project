const mysql = require("mysql")

function dropTables() {
  db_conn.query("DROP TABLE Media");
  db_conn.query("DROP TABLE Crew");
  db_conn.query("DROP TABLE Produced");
  db_conn.query("DROP TABLE Role");
  db_conn.query("DROP TABLE PlaysIn");
  db_conn.query("DROP TABLE Collection");
  db_conn.query("DROP TABLE HasNotes");
}

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
  
  'Crew(crewID VARCHAR (100) NOT NULL, name VARCHAR (100), role VARCHAR (100), PRIMARY KEY (crewID))',
  'Produced(crewID VARCHAR (100) NOT NULL REFERENCES Crew(crewID), titleID VARCHAR (100) NOT NULL REFERENCES Media(titleID), PRIMARY KEY (crewID, titleID))',
  
  'Role(roleID VARCHAR (100) NOT NULL, name VARCHAR (100) NOT NULL, characterName VARCHAR (100), PRIMARY KEY (roleID))',
  'PlaysIn(roleID VARCHAR (100) NOT NULL REFERENCES Role(roleID), titleID VARCHAR (100) NOT NULL REFERENCES Media(titleID), PRIMARY KEY (roleID, titleID))',

  'Collection(collectionID VARCHAR (100) NOT NULL, notes VARCHAR (1000), isWatched BOOL, rating DOUBLE(2,1), PRIMARY KEY (collectionID))',
  'HasNotes(titleID VARCHAR (100) NOT NULL REFERENCES Media(titleID), collectionID VARCHAR (100) NOT NULL REFERENCES Collection(collectionID), PRIMARY KEY (titleID, collectionID))',
]
for (let query of create_table_query) {
  db_conn.query("CREATE TABLE IF NOT EXISTS " + query, (error) => {
    if(error) throw error;
    //console.log("Created Table " + query);
  });
}

// SAMPLE DATA INSERTION, IF THEY DON'T ALREADY EXIST

let media = [
  "'gww', 'Gone With the Wind', '1939-11-01', 9.8, 10923",
  "'tgf', 'The Godfather', '1972-05-16', 9.5, 11998",
  "'tsr', 'The Shawshank Redemption', '1994-06-07', 9.8, 17789",
  "'tdk', 'The Dark Knight', '2008-10-19', 8.7, 20912",
  "'ttc', 'Titanic', '1997-03-03', 9.3, 14384"
]

for (let medium of media) {
  db_conn.query("INSERT INTO Media Values(" + medium + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(medium + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + medium);
    }
  });
}

db_conn.query("SELECT * FROM Media;", (error, results, fields) => {
  //console.log(results);
})

let crews = [
  "'vfg', 'Victor Fleming', 'Director'",
  "'gcr', 'George Cukor', 'Director'",
  "'ffc', 'Francis Ford Coppola', 'Director'",
  "'fdt', 'Frank Darabont', 'Director'",
  "'cnn', 'Christopher Nolan', 'Director'",
  "'jcn', 'James Cameron', 'Director'",
]

for (let crew of crews) {
  db_conn.query("INSERT INTO Crew Values(" + crew + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(crew + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + crew);
    }
  });
}

db_conn.query("SELECT * FROM Crew;", (error, results, fields) => {
  //console.log(results);
})

let produces = [
  "'vfg', 'gww'",
  "'gcr', 'gww'",
  "'ffc', 'tgf'",
  "'fdt', 'tsr'",
  "'cnn', 'tdk'",
  "'jcn', 'ttc'",
]

for (let produce of produces) {
  db_conn.query("INSERT INTO Produced Values(" + produce + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(produce + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + produce);
    }
  });
}

db_conn.query("SELECT * FROM Produced;", (error, results, fields) => {
  //console.log(results);
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