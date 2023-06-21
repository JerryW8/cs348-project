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
  'Media(titleID VARCHAR(100) NOT NULL, originalTitle VARCHAR(100), genre VARCHAR(100), startYear DATE, rating DOUBLE(2,1), numVotes INT, PRIMARY KEY (titleID))',
  
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
  "'gww', 'Gone With the Wind', 'Romance', '1939-11-01', 9.8, 10923",
  "'tgf', 'The Godfather', 'Drama', '1972-05-16', 9.5, 11998",
  "'tsr', 'The Shawshank Redemption', 'Drama', '1994-06-07', 9.8, 17789",
  "'tdk', 'The Dark Knight', 'Action', '2008-10-19', 8.7, 20912",
  "'ttc', 'Titanic', 'Romance', '1997-03-03', 9.3, 14384"
]

for (let i of media) {
  db_conn.query("INSERT INTO Media Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
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

for (let i of crews) {
  db_conn.query("INSERT INTO Crew Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
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

for (let i of produces) {
  db_conn.query("INSERT INTO Produced Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
    }
  });
}

db_conn.query("SELECT * FROM Produced;", (error, results, fields) => {
  //console.log(results);
})

let roles = [
  "'0', 'Vivien Leigh', 'Scarlett OHara'",
  "'1', 'Clark Gable', 'Rhett Butler'",
  "'2', 'Al Pacino', 'Michael Corleone'",
  "'3', 'Marlon Brando', 'Vito Corleone'",
  "'4', 'Morgan Freeman', 'Ellis Boyd Redding'",
  "'5', 'Tim Robbins', 'Dufresne'",
  "'6', 'Christian Bale', 'Batman'",
  "'7', 'Michael Caine', 'Alfred'",
  "'8', 'Leonardo DiCaprio', 'Jack Dawson'",
  "'9', 'Kate Winslet', 'Rose Dewitt Bukater'"
]

for (let i of roles) {
  db_conn.query("INSERT INTO Role Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
    }
  });
}

let playins = [
  "'0', 'gww'",
  "'1', 'gww'",
  "'2', 'tgf'",
  "'3', 'tgf'",
  "'4', 'tsr'",
  "'5', 'tsr'",
  "'6', 'tdk'",
  "'7', 'tdk'",
  "'8', 'ttc'",
  "'9', 'ttc'",
]

for (let i of playins) {
  db_conn.query("INSERT INTO PlaysIn Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
    }
  });
}

let collection = [
  "'c0', 'Pretty good', true, 8.9",
  "'c1', 'Good', true, 7.6"
]

for (let i of collection) {
  db_conn.query("INSERT INTO Collection Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
    }
  });
}

let hasNotes = [
  "'tdk', 'c0'",
  "'ttc', 'c1'"
]

for (let i of hasNotes) {
  db_conn.query("INSERT INTO HasNotes Values(" + i + ");", (error) => {
    if(error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(i + " already inserted")
      } else {
        throw error
      }
    } else {
      console.log("Completed insertion " + i);
    }
  });
}

db_conn.end()
  