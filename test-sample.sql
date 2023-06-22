-- Gets the media with given title
-- NOTE: "Titanic" is just a place holder
SELECT * FROM media WHERE originTitle = "Titanic"

-- Gets the media with given genre
-- NOTE: "Drama" is just a place holder
SELECT * FROM media WHERE genre = "Drama"

-- Gets the media with given rating
-- NOTE: 8.0 is just a place holder
SELECT * FROM media WHERE rating >= 8.0

-- Gets the media with given startYear
-- NOTE: 1997 is just a place holder
SELECT * FROM media WHERE YEAR(startYear) >= 1997
ORDER BY startYear DESC

-- Updates the collection with given information and collectionID
-- NOTE: "Not too bad" and "c0" are just place holders
UPDATE Collection SET notes = "Not too bad" WHERE collectionID = "c0"

-- Delete an entry in collection with given collectionID
-- NOTE: "c1" is just a place holder
DELETE FROM Collection WHERE collectionID = "c1"

-- Gets the recommended media with given genre and given titileID
-- NOTE: "Romance" and "ttc" are just place holders
SELECT * FROM media WHERE genre = "Romance" AND rating >= 8.5 AND titleID <> "ttc"


-- Gets the crew members who produced the media and their other films
-- NOTE: "tgf" is just a placeholder
SELECT * FROM Crew
  NATURAL JOIN Produced
  NATURAL JOIN Media
  WHERE crewID IN (SELECT crewID FROM Produced WHERE titleID = "tgf")

-- Gets the actors who played in the media and their other films
-- NOTE: "tgf" is just a placeholder
SELECT * FROM Role
  NATURAL JOIN PlaysIn
  NATURAL JOIN Media
  WHERE roleID IN (SELECT roleID FROM PlaysIn WHERE titleID = "tgf")

