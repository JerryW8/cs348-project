*ALL data in this project provided by IMDb: https://developer.imdb.com/non-commercial-datasets/*

Getting mysql running on Mac after installing mysql and enter `y` when prompted to set up mysql. Also, enter `cs348cs348` as your password.
```
mysql.server start
mysql_secure_installation
mysql -u root -p
```
If you encounter an issue that looks like
```
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client 
```
then try using the solution in this [article](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server#:~:text=1791-,Execute%20the%20following%20query%20in%20MYSQL%20Workbench,-ALTER%20USER%20%27root).

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
And then go over to localhost:3000 as wel as localhost:3000/collection for the two primary views. As this project is updated you may need to clear your browser cache.

---
Sample data:<br />
If you wish to load the sample data (not production data), uncomment everything after line 74 in db.js and run. Uncomment line 40 
```
dropTables()
```
to clear existing data in the database.
```
node db.js
```
