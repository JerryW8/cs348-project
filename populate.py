import mysql.connector
import pandas as pd
import math
import os

cnx = mysql.connector.connect(user='root', password='cs348cs348',
                              host='localhost',
                              database='projectdb')
cursor = cnx.cursor()

def populateMovies():
    cursor.execute("DELETE FROM Media")
    df = pd.read_csv(os.path.join('data', 'title.movies.tsv'), sep='\t', na_values=['\\N'])
    for index, row in df.iterrows():
        tid = row['tconst']
        title = str(row['primaryTitle']).replace("'", "\\'")
        genre = 'NULL' if pd.isnull(row['genres']) else row['genres'].split(',')[0]
        year = 'NULL' if pd.isnull(row['startYear']) else row['startYear']
        rating = 'NULL' if pd.isnull(row['averageRating']) else row['averageRating']
        numVotes = 'NULL' if pd.isnull(row['numVotes']) else int(row['numVotes'])
        try:
            query = f"INSERT INTO Media Values('{tid}', '{title}', '{genre}', {year}, {rating}, {numVotes})"
            cursor.execute(query)
        except Exception as e:
            print(f"MEDIA ERROR: {e}")
        if index % 5000 == 0:
            cnx.commit()
    cnx.commit()

def populateCast():
    cursor.execute("DELETE FROM Role")
    cursor.execute("DELETE FROM PlaysIn")
    df = pd.read_csv(os.path.join('data', 'title.cast.tsv'), sep='\t', na_values=['\\N'])
    for index, row in df.iterrows():
        tid = row['tconst']
        rid = row['tconst'] + row['nconst']
        name = row['primaryName'].replace("'", "\\'")
        character = 'NULL' if pd.isnull(row['characters']) else row['characters'][2:-2].split(",")[0].replace("'", "\\'")
        try:
            query = f"INSERT INTO Role Values('{rid}', '{name}', '{character}')"
            cursor.execute(query)
        except Exception as e:
            print(f"ROLE ERROR: {e}")
        try:
            query = f"INSERT INTO PlaysIn Values('{rid}', '{tid}')"
            cursor.execute(query)
        except Exception as e:
            print(f"PlaysIn ERROR: {e}")
        if index % 5000 == 0:
            cnx.commit()
    cnx.commit()

def populateCrew():
    cursor.execute("DELETE FROM Crew")
    cursor.execute("DELETE FROM Produced")
    df = pd.read_csv(os.path.join('data', 'title.directors.tsv'), sep='\t', na_values=['\\N'])
    for index, row in df.iterrows():
        tid = row['tconst']
        cid = row['tconst'] + row['nconst']
        name = row['primaryName'].replace("'", "\\'")
        role = row['category']
        try:
            query = f"INSERT INTO Crew Values('{cid}', '{name}', '{role}')"
            cursor.execute(query)
        except Exception as e:
            print(f"Crew ERROR: {e}")
        try:
            query = f"INSERT INTO Produced Values('{cid}', '{tid}')"
            cursor.execute(query)
        except Exception as e:
            print(f"Produced ERROR: {e}")
        if index % 5000 == 0:
            cnx.commit()
    cnx.commit()

populateMovies()
print("Populated media")
populateCast()
print("Populated cast")
populateCrew()
print("Populated crew")

cursor.execute("SELECT * FROM Produced")
rows = cursor.fetchall()
with open("test.out", 'w') as file:
    for row in rows:
        file.write(str(row) + "\n")

cursor.close()
cnx.close()