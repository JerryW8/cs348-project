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

