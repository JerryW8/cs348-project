*ALL data in this project provided by IMDb: https://developer.imdb.com/non-commercial-datasets/*

Getting mysql running on Mac after installing mysql
```
mysql.server start
mysql_secure_installation
mysql -u root -p
```
Enter cs348cs348 as your password.

Installing dependencies:
```
python3 -m pip install mysql-connector-python
python3 -m pip install pandas
npm i
```

Initiate tables:
```
npm run init
npm run populate
```
Some of the data will not be able to fit into the schema and as a result will fail to be loaded.

Start app:
```
npm run start
```
As this project is updated you may need to clear your browser cache.
