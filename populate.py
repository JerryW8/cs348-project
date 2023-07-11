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

def populateCollection():
    cursor.execute("DELETE FROM Collection")
    cursor.execute("DELETE FROM HasNotes")
    collectionQueries = [
        "'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id semper libero, sed rhoncus nulla. Maecenas porta faucibus purus, tempus volutpat leo molestie at. Nullam imperdiet bibendum diam, ac aliquet enim placerat et. Mauris pulvinar suscipit bibendum. Morbi non placerat libero. Vestibulum rutrum dignissim tincidunt.', true, 7.8",
        "'Proin lectus felis, tincidunt vitae lacus a, placerat ornare leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean lectus risus, congue id congue et, suscipit et turpis. Vivamus tempor eu libero id ultricies. Nulla faucibus finibus porttitor. Nulla viverra vitae leo vitae hendrerit.', true, 9.6",
        "'Nulla viverra vitae leo vitae hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi fringilla, mi sit amet fringilla consectetur, nibh justo lacinia libero, quis sodales lacus nunc non lacus. In hac habitasse platea dictumst.', false, NULL",
        "'Praesent mattis nisl vel enim malesuada congue. Integer interdum congue massa non consequat. Morbi convallis interdum tortor sit amet vehicula. Etiam convallis, lectus et molestie sagittis, metus lacus ultricies enim, vitae condimentum nisl diam vel sapien.', true, 4.5",
        "'Praesent viverra vitae nibh at varius. Phasellus sit amet quam vitae tellus dapibus sollicitudin at non enim. Sed scelerisque in dolor in fermentum. Nam convallis nisi id tellus bibendum tincidunt. Duis vehicula, ex consectetur sagittis commodo, justo ex vehicula purus, vel pulvinar mi mi at metus. Nullam a rutrum magna.', false, NULL"
    ]
    correspondingTitleIDs = [
        "tt2582802", "tt6751668", "tt0816692", "tt7784604", "tt0780504"
    ]
    for idx, query in enumerate(collectionQueries):
        cursor.execute(f"INSERT INTO Collection Values(0, {query})")
        cursor.execute(f"INSERT INTO HasNotes Values('{correspondingTitleIDs[idx]}', {cursor.lastrowid})")
    cnx.commit()



populateMovies()
print("Populated media")
populateCast()
print("Populated cast")
populateCrew()
print("Populated crew")
populateCollection()
print("Populated collection")

cursor.execute("SELECT * FROM HasNotes")
rows = cursor.fetchall()
with open("test.out", 'w') as file:
    for row in rows:
        file.write(str(row) + "\n")

cursor.close()
cnx.close()