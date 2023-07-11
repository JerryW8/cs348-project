-- Indexes for performance tuning
CREATE INDEX originalTitleIndex ON Media(originalTitle);
CREATE INDEX genreIndex ON Media(genre);
CREATE INDEX ratingIndex ON Media(rating);
CREATE INDEX startYearIndex ON Media(startYear);
CREATE INDEX recommendedIndex ON Media(genre, rating, titleID);

-- Gets the media with a title containing the given string
SELECT * FROM media WHERE originalTitle LIKE "%Titanic%" LIMIT 10;

-- Gets the media with given genre
SELECT * FROM media WHERE genre = "Drama" LIMIT 10;

-- Gets the media with given rating
SELECT * FROM media WHERE rating >= 8.0 LIMIT 10;

-- Gets the media with given startYear
SELECT * FROM media WHERE startYear >= 1997
ORDER BY startYear DESC LIMIT 10;

-- Gets movie recommendations based on currently viewed movie
SELECT * FROM media WHERE genre = "Action" AND rating >= 8.5 AND titleID <> "tt0848228" LIMIT 10;

-- Gets the crew members who produced the media and their other films
SELECT * FROM Crew
 	NATURAL JOIN Produced
 	NATURAL JOIN Media
 	WHERE RIGHT(CrewID, 9) IN 
  (SELECT RIGHT(crewID, 9) FROM Produced 
  WHERE titleID = "tt1399103") 
  AND titleID <> "tt1399103" LIMIT 10;


-- Gets the actors who played in the media and their other films
SELECT * FROM Role
 	NATURAL JOIN PlaysIn
 	NATURAL JOIN Media
 	WHERE RIGHT(roleID, 9) IN 
  (SELECT RIGHT(roleID, 9) FROM PlaysIn 
  WHERE titleID = "tt1399103") 
  AND titleID <> "tt1399103" LIMIT 10;

-- Add a movie to watchlist
INSERT INTO Collection(collectionID) VALUES(NULL);
INSERT INTO HasNotes VALUES("tt0011801", 6);

-- Remove a movie from watchlist
DELETE FROM Collection WHERE collectionID = 1;
DELETE FROM HasNotes WHERE collectionID = 1 AND titleID = "tt2582802";

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
INSERT INTO Media Values("tt0000000","sample media" , "sample genre", 2023, 0.0, 0);

-- Update startYear of a given movie
UPDATE Media SET startYear = 2000 WHERE titleID= "tt0000000";

-- Update originalTitle of a given movie
UPDATE Media SET originalTitle = "updated name for sample media" WHERE titleID = "tt0000000";

-- Update genre of a given movie
UPDATE Media SET genre = "new sample genre" WHERE titleID = "tt0000000";

-- Update rating of a given movie
UPDATE Media SET rating = 9.0 WHERE titleID = "tt0000000";

-- Update numVotes of a given movie
UPDATE Media SET numVotes= 1 WHERE titleID = "tt0000000";

-- Delete a movie from the media
DELETE FROM Media WHERE titleID = "tt0000000";
