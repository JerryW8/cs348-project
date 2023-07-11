*ALL data in this project provided by IMDb: https://developer.imdb.com/non-commercial-datasets/*

Getting mysql running on Mac after installing mysql
```
mysql.server start
mysql_secure_installation
mysql -u root -p
```
Enter cs348cs348 as your password.

---
Installing dependencies:
```
python3 -m pip install mysql-connector-python
python3 -m pip install pandas
npm i
```
---
Initiate tables:
```
npm run init
npm run populate
```
or optionally you may instead run the equivalent literal commands
```
node db.js
python3 populate.py
```
All warnings/errors can be safely ignored for now.

---
Start app:
```
npm run start
```
or optionally you may instead run the equivalent literal command
```
nodemon app.js
```
As this project is updated you may need to clear your browser cache.

---
Sample data:<br />
Sample data: If you wish to load the sample data (not production data), uncomment everything after line 74 in db.js and run. Uncomment line 40 (dropTables()) to clear existing data in the database.
```
node db.js
```
