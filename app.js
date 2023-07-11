const mysql = require("mysql");
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

let db_name = 'projectdb';
let useQuery = `USE ${db_name}`;
db_conn.query(useQuery);


const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Search movie based on any parameter
app.get('/media', (req, res) => {
    let sql = `SELECT * FROM media WHERE TRUE`;
    if (req.query.title) {
        sql += ` AND originalTitle LIKE "%${req.query.title}%"`;
    }
    if (req.query.genre) {
        sql += ` AND genre = "${req.query.genre}"`;
    }
    if (req.query.year) {
        sql += ` AND startYear >= "${req.query.year}" ORDER BY startYear DESC`;
    }
    if (req.query.rating) {
        // possibly add <,>,<=,>= options
        sql += ` AND rating >= "${req.query.rating}"`;
    }
    if (req.query.page) {
        // pagination implementation
    }
    db_conn.query(sql, (err, result) => {
        if (err) throw err;
        res.render('index', {media: result});
    });
});

// Display information about a movie
app.get('/media/:titleid', (req, res) => {
    let castsql = `SELECT name, characterName FROM PlaysIn NATURAL JOIN Role WHERE PlaysIn.titleID = "${req.params.titleid}";`;
    let crewsql = `SELECT name, role FROM Produced NATURAL JOIN Crew WHERE Produced.titleID = "${req.params.titleid}";`;
    let similarsql = `SELECT m1.titleID, m1.originalTitle FROM Media m1, Media m2 
                        WHERE m2.titleID = "${req.params.titleid}" AND m1.genre = m2.genre AND m1.rating >= 8.5 LIMIT 10;`;
    let sameCrewsql = `SELECT DISTINCT titleID, originalTitle FROM Crew
                        NATURAL JOIN Produced
                        NATURAL JOIN Media
                        WHERE RIGHT(crewID, 9) IN (SELECT RIGHT(crewID, 9) FROM Produced WHERE titleID = "${req.params.titleid}")
                        AND titleID <>"${req.params.titleid}"
                        LIMIT 10;`;
    let sameCastsql = `SELECT DISTINCT titleID, originalTitle FROM Role
                        NATURAL JOIN PlaysIn
                        NATURAL JOIN Media
                        WHERE RIGHT(roleID, 9) IN (SELECT RIGHT(roleID, 9) FROM PlaysIn WHERE titleID = "${req.params.titleid}")
                        AND titleID <>"${req.params.titleid}"
                        LIMIT 10;`;
    let mediaTitle = `SELECT originalTitle FROM Media WHERE titleID="${req.params.titleid}";`;
    
    db_conn.query(castsql, (err, castresult) => {
        if (err) throw err;
        db_conn.query(crewsql, (err, crewresult) => {
            if (err) throw err;
            db_conn.query(similarsql, (err, similarresult) => {
                if (err) throw err;
                db_conn.query(sameCrewsql, (err, samecrewresult) => {
                    if (err) throw err;
                    db_conn.query(sameCastsql, (err, samecastresult) => {
                        if (err) throw err;
                        db_conn.query(mediaTitle, (err, title) => {
                            if (err) throw err;
                            res.render('media', {cast: castresult, crew: crewresult, similarMedia: similarresult, similarCrew: samecrewresult, similarCast: samecastresult, title: title[0]});
                        });
                    });
                });
            });
        });
    });

});

app.get('/', (req, res) => {
    res.render('index', {media: null});
});

app.listen('3000', () => {
    console.log(`Server is up and running on 3000 ...`);
});