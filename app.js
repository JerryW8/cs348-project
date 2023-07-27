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
    let where = " WHERE TRUE"
    if (req.query.title) {
        where += ` AND originalTitle LIKE "%${req.query.title}%"`;
    }
    if (req.query.genre) {
        where += ` AND genre = "${req.query.genre}"`;
    }
    if (req.query.rating) {
        where += ` AND rating >= "${req.query.rating}"`;
    }
    if (req.query.year) {
        where += ` AND startYear >= "${req.query.year}"`;
    }
    let sql = `SELECT SQL_CALC_FOUND_ROWS * FROM media ${where} GROUP BY titleid`
    if (req.query.year) {
        sql += ` ORDER BY startYear DESC`;
    }
    if (req.query.page) {
        sql += ` LIMIT 100 OFFSET ${(req.query.page - 1) * 100}`
    } else {
        sql += ` LIMIT 100 OFFSET 0`
    }
    let newURL = `/media?title=${req.query.title ?? ""}&genre=${req.query.genre ?? ""}&year=${req.query.year ?? ""}&rating=${req.query.rating ?? ""}`
    db_conn.query(sql, (err, result) => {
        if (err) throw err;
        db_conn.query("SELECT FOUND_ROWS()", (err, qTotal) => {
            if (err) throw err;
            res.render('index', {media: result, total: qTotal[0]['FOUND_ROWS()'], newURL: newURL, curPage: req.query.page ? parseInt(req.query.page) : 1});
        });
    });
});

// Display information about a movie
app.get('/media/:titleid', async (req, res) => {
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
    let mediaInfo = `SELECT * FROM Media WHERE titleID="${req.params.titleid}";`;

    try {
        let castresult, crewresult, similarresult, samecrewresult, samecastresult, media
        // concurrent implementation, either i'm mistaken that these run concurrently or queries just do run for a long time
        promises = [
            new Promise((resolve) => {
                db_conn.query(castsql, (err, result) => {
                    if (err) throw err;
                    console.log(result)
                    castresult = result
                    resolve()
            })}),
            new Promise((resolve) => {
                db_conn.query(crewsql, (err, result) => {
                    if (err) throw err;
                    console.log(result)
                    crewresult = result
                    resolve()
            })}),
            new Promise((resolve) => {
                db_conn.query(similarsql, (err, result) => {
                    if (err) throw err;
                    console.log(result)
                    similarresult = result
                    resolve()
            })}),
            new Promise((resolve) => {
                db_conn.query(sameCrewsql, (err, result) => {
                    if (err) throw err;
                    console.log(result)
                    samecrewresult = result
                    resolve()
            })}),
            new Promise((resolve) => {
                db_conn.query(sameCastsql, (err, result) => {
                    if (err) throw err;
                    console.log(result)
                    samecastresult = result
                    resolve()
            })}),
            new Promise((resolve) => {
                db_conn.query(mediaInfo, (err, result) => {
                    if (err) throw err;
                    console.log(result)
                    media = result[0]
                    resolve()
            })}),
        ]
        Promise.all(promises).then(() => {
            res.render('media', {cast: castresult, crew: crewresult, similarMedia: similarresult, similarCrew: samecrewresult, similarCast: samecastresult, media: media, titleID: req.params.titleid}); 
        })
    } catch (error) {
        throw error
    }
});

// Checks if a titleID already exists. Used for adding a movie
app.get('/media/checkTitleID/:titleID', (req, res) => {
    let titleID = req.params.titleID
  
    db_conn.query(`SELECT COUNT(*) AS count FROM Media WHERE titleID = "${titleID}"`, (err, result) => {
      if (err) throw err
      const count = result[0].count;
      res.json({ exists: count > 0 });
    })
  })

// Add a movie
app.post('/media/create', (req, res) => {
    let body = req.body
    if (!body.addStartYear) {
        body.addStartYear = "NULL"
    }
    if (!body.addRating) {
        body.addRating = "NULL"
    }
    if (!body.addNumVotes) {
        body.addNumVotes = "NULL"
    }
    let createMediaSql = `INSERT INTO Media VALUES(
        "${body.addTitleID}", 
        "${body.addTitle}", 
        "${body.addGenre}", 
        ${body.addStartYear}, 
        ${body.addRating}, 
        ${body.addNumVotes})
    `
    db_conn.query(createMediaSql, (err, result) => {
        if (err) throw err;
        res.redirect("back")
    })
})

// Update a movie
app.post('/media/:titleID/update', (req, res) => {
    let body = req.body
    if (!body.startYear) {
        body.startYear = "NULL"
    }
    if (!body.mediaRating) {
        body.mediaRating = "NULL"
    }
    if (!body.numVotes) {
        body.numVotes = "NULL"
    }
    let sql = `UPDATE Media SET 
        originalTitle="${body.mediaTitle}",
        genre="${body.mediaGenre}",
        startYear=${body.startYear},
        rating=${body.mediaRating},
        numVotes=${body.numVotes} 
    WHERE titleID="${req.params.titleID}"`

    db_conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.redirect("back")
    });
})

// Delete a movie
app.post('/media/:titleID/delete', (req, res) => {
    console.log('DELETEE')
    let sql = `DELETE FROM Media WHERE titleID = "${req.params.titleID}"`
    db_conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.redirect("/media")
    });
})

// View your collection
app.get('/collection', (req, res) => {
    let collectionSql = `SELECT originalTitle, collectionID, isWatched, Collection.rating, notes
                FROM Collection NATURAL JOIN HasNotes h JOIN Media m ON h.titleID = m.titleID`;
    let recsSql = `SELECT * FROM Media WHERE rating >= 8.5 AND genre IN 
	                        (SELECT genre FROM HasNotes hn NATURAL JOIN Collection c JOIN Media m ON m.titleID = hn.titleID WHERE c.rating >= 8.5) LIMIT 10;`;
    try {
        let collectionResult, recsResult
        
        promises = [
            new Promise((resolve) => {
                db_conn.query(collectionSql, (err, res) => {
                    if (err) throw err;
                    console.log(res)
                    collectionResult = res
                    resolve()
                })
            }),
            new Promise((resolve) => {
                db_conn.query(recsSql, (err, res) => {
                    if (err) throw err;
                    console.log(res)
                    recsResult = res
                    resolve()
                })
            })
        ]
        Promise.all(promises).then(() => {
            res.render('collection-index', {media: collectionResult, recommendations: recsResult}); 
        })
    } catch (err) {
        throw err
    }    
});

// View a movie in your collection
app.get('/collection/:collectionID', (req, res) => {
    let sql = `SELECT m.titleID, originalTitle, collectionID, isWatched, Collection.rating, notes
                FROM Collection NATURAL JOIN HasNotes h JOIN Media m ON h.titleID = m.titleID WHERE collectionID = "${req.params.collectionID}"`;
    db_conn.query(sql, (err, result) => {
        if (err) throw err;
        res.render('collection', {media: result[0]});
    });
});

// Add to collection
app.post('/collection/:titleid/create', (req, res) => {
    let collectionInsertSql = `INSERT INTO Collection(isWatched, collectionID) VALUES(false, NULL);`
    db_conn.query(collectionInsertSql, (err, result) => {
        if (err) throw err; 
        let hasNotesInsertSql = `INSERT INTO HasNotes VALUES("${req.params.titleid}", ${result.insertId});`
        db_conn.query(hasNotesInsertSql, (err, result) => {
            if (err) throw err; 
            res.redirect("back")
        });
    });
});

// Update to collection
// NOTE: since HTML forms only support post, this uses a post method, differentiated by the 'update' in the url
app.post('/collection/:collectionID/update', (req, res) => {
    let body = req.body
    if (body.rating.length == 0) body.rating = "NULL"
    let sql = `UPDATE Collection SET isWatched=${body.isWatched},rating=${body.rating},notes="${body.notes}" WHERE collectionID=${req.params.collectionID}`;
    db_conn.query(sql, (err, result) => {
        if (err) throw err; 
        res.redirect("back")
    });
});

// Delete from collection
app.post('/collection/:collectionID/delete', (req, res) => {
    let collectionDeleteSql = `DELETE FROM Collection WHERE collectionID = ${req.params.collectionID}`
    let hasNotesDeleteSql = `DELETE FROM HasNotes WHERE collectionID = ${req.params.collectionID}`
    db_conn.query(collectionDeleteSql, (err, result) => {
        if (err) throw err; 
        db_conn.query(hasNotesDeleteSql, (err, result) => {
            if (err) throw err; 
            res.redirect("/collection")
        });
    });
});

app.get('/', (req, res) => {
    res.render('index', {media: null, curPage: 0});
});

app.listen('3000', () => {
    console.log(`Server is up and running on 3000 ...`);
});