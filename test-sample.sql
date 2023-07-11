-- Gets the media with given title
-- NOTE: "Titanic" is just a place holder
SELECT * FROM media WHERE originalTitle LIKE "%Titanic%";

-- Gets the media with given genre
-- NOTE: "Drama" is just a place holder
SELECT * FROM media WHERE genre = "Drama";

-- Gets the media with given rating
-- NOTE: 8.0 is just a place holder
SELECT * FROM media WHERE rating >= 8.0;

-- Gets the media with given startYear
-- NOTE: 1997 is just a place holder
SELECT * FROM media WHERE startYear >= 1997
ORDER BY startYear DESC;

-- Gets the recommended media with given genre and given titileID
-- NOTE: "Romance" and "ttc" are just place holders
SELECT * FROM media WHERE genre = "Romance" AND rating >= 8.5 AND titleID <> "ttc";

-- Gets the crew members who produced the media and their other films
-- NOTE: "tgf" is just a placeholder
SELECT * FROM Crew
 	NATURAL JOIN Produced
 	NATURAL JOIN Media
 	WHERE RIGHT(CrewID, 9) IN 
  (SELECT RIGHT(crewID, 9) FROM PRODUCED 
  WHERE titleID = "tgf") AND titleID <> "tgf";

-- Gets the actors who played in the media and their other films
-- NOTE: "tgf" is just a placeholder
SELECT * FROM Role
 	NATURAL JOIN PlaysIn
 	NATURAL JOIN Media
 	WHERE RIGHT(roleID, 9) IN 
  (SELECT RIGHT(roleID, 9) FROM PlaysIn 
  WHERE titleID = "tgf") AND titleID <> "tgf";

-- Add a movie to watchlist
INSERT INTO Collection(collectionID) VALUES(NULL);
INSERT INTO HasNotes VALUES("gww", 4);

-- Remove a movie from watchlist
DELETE FROM Collection WHERE collectionID = 1;
DELETE FROM HasNotes WHERE collectionID = 1 AND titleID = "tdk";

-- View media in the watchlist
SELECT * FROM Collection 
  NATURAL JOIN HasNotes h 
  JOIN Media m ON h.titleID = m.titleID;

-- Update the rating of a movie in the watchlist
UPDATE Collection SET rating = 9.8 WHERE collectionID = 1;

-- Update the notes of a movie in the watchlist
UPDATE Collection SET notes = "Great movie!" WHERE collectionID = 2;

-- Update whether the movie has been watched
UPDATE Collection SET isWatched = true WHERE collectionID = 3;

-- Insert new movies into media
INSERT INTO Media Values("aaa","sample media" , "sample genre", 2023, 0.0, 0);

-- Update startYear of a given movie
UPDATE Media SET startYear = 2000 WHERE titleID= "aaa";

-- Update originalTitle of a given movie
UPDATE Media SET originalTitle = "updated name for sample media" WHERE titleID = "aaa";

-- Update genre of a given movie
UPDATE Media SET genre = "new sample genre" WHERE titleID = "aaa";

-- Update rating of a given movie
UPDATE Media SET rating = 9.0 WHERE titleID = "aaa";

-- Update numVotes of a given movie
UPDATE Media SET numVotes= 1 WHERE titleID = "aaa";

-- Delete a movie from the media
DELETE FROM Media WHERE titleID = "aaa";
