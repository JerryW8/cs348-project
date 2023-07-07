const mysql = require("mysql")
const express = require("express");

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
let useQuery = `USE ${db_name}`;
db_conn.query(useQuery);


const app = express();
app.set('views', './views');
app.set('view engine', 'ejs')

// Search movie based on any parameter
app.get('/media', (req, res) => {
    let sql = `SELECT * FROM media WHERE TRUE`;
    if (req.query.title) {
        sql += ` AND originalTitle = "${req.query.title}"`
    }
    if (req.query.genre) {
        sql += ` AND genre = "${req.query.genre}"`
    }
    if (req.query.year) {
        sql += ` AND startYear = "${req.query.year}"`
    }
    if (req.query.rating) {
        // possibly add <,>,<=,>= options
        sql += ` AND rating >= "${req.query.rating}"`
    }
    if (req.query.page) {
        // pagination implementation
    }
    db_conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send(`${JSON.stringify(result)}`);
    });
});

// Display information about a movie
app.get('/media/:titleid', (req, res) => {
    let castsql = `SELECT name, characterName FROM PlaysIn NATURAL JOIN Role WHERE PlaysIn.titleID = "${req.params.titleid}"`;
    let crewsql = `SELECT name, role FROM Produced NATURAL JOIN Crew WHERE Produced.titleID = "${req.params.titleid}"`
    let similarsql = `SELECT m1.titleID, m1.originalTitle FROM Media m1, Media m2 
                        WHERE m2.titleID = "${req.params.titleid}" AND m1.genre = m2.genre AND m1.rating >= 7.5 LIMIT 10`
    let sameCrewsql = `SELECT DISTINCT titleID, originalTitle FROM Crew
                        NATURAL JOIN Produced
                        NATURAL JOIN Media
                        WHERE RIGHT(crewID, 9) IN (SELECT RIGHT(crewID, 9) FROM Produced WHERE titleID = "${req.params.titleid}")
                        AND titleID <>"${req.params.titleid}"
                        LIMIT 10`
    let sameCastsql = `SELECT DISTINCT titleID, originalTitle FROM Role
                        NATURAL JOIN PlaysIn
                        NATURAL JOIN Media
                        WHERE RIGHT(roleID, 9) IN (SELECT RIGHT(roleID, 9) FROM PlaysIn WHERE titleID = "${req.params.titleid}")
                        AND titleID <>"${req.params.titleid}"
                        LIMIT 10`
    
    db_conn.query(castsql, (err, castresult) => {
        if (err) throw err;
        db_conn.query(crewsql, (err, crewresult) => {
            if (err) throw err
            db_conn.query(similarsql, (err, similarresult) => {
                if (err) throw err
                db_conn.query(sameCrewsql, (err, samecrewresult) => {
                    if (err) throw err
                    db_conn.query(sameCastsql, (err, samecastresult) => {
                        if (err) throw err
                        res.send(
                        `Cast: ${JSON.stringify(castresult)} 
                        <br><br>
                        Crew: ${JSON.stringify(crewresult)}
                        <br><br>
                        Recommended movies if you like this: ${JSON.stringify(similarresult)}
                        <br><br>
                        Other movies with similar crew: ${JSON.stringify(samecrewresult)}
                        <br><br>
                        Other movies with similar cast: ${JSON.stringify(samecastresult)}
                        `);
                    });
                });
            });
        });
    });

});

// Select movies in genre
app.get('/genre/:genre', (req, res) => {
    let sql = `SELECT * FROM media WHERE genre = "${req.params.genre}"`;
    let query = db_conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`All Media with ${req.params.genre} found in database. \n ${JSON.stringify(result)}`);
    });
});

// Find movie
app.get("/movies/:title", (req, res) => {
    let sql = `SELECT * FROM Media WHERE originalTitle = "${req.params.title}"`;
    let query = db_conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`${req.params.title} found in database. \n ${JSON.stringify(result)}`);
    });
});

// Find movie
app.get("/rating/:rating", (req, res) => {
    let sql = `SELECT * FROM media WHERE rating >= "${req.params.rating}"`;
    let query = db_conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`Media with at least ${req.params.rating} found in database. \n ${JSON.stringify(result)}`);
    });
});


app.get('/', (req, res) => {
    res.render('index');
});

app.listen('3000', () => {
    console.log(`Server is up and running on 3000 ...`);
});