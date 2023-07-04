*ALL data in this project provided by IMDb: https://developer.imdb.com/non-commercial-datasets/*

Getting mysql running on Mac after installing mysql
```
mysql.server start
mysql_secure_installation
mysql -u root -p
```

```
python3 -m pip install mysql-connector-python
python3 populate.py
```

Install necessary dependencies by running
```
npm install
```

Enter 'cs348cs348' as your password. Then run
```
node db
```
to load the database.

MILESTONE 1

We have provided buttons for the features on the home page, which load the query results after they are clicked into the page and the terminal.

You can run 
```
node db.js
```
to test the project at localhost:3000.
