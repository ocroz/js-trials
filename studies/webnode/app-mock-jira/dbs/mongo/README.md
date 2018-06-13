# Mongo database

## Mongo installation

Download and install Windows msi from https://www.mongodb.com/download-center#community.

Update the PATH with "C:\Program Files\MongoDB\Server\3.6\bin".

## Start mongo daemon

```bash
mongod --dbpath src/dbs/mongo/db/ &
```

## Create database

```bash
database=localjira
mongo $database src/dbs/mongo/scripts/*
```

## Mongo shell

```bash
mongo
> help
> show dbs
> use localjira // or whatever other database
> show collections
> var collection='issues' // or whatever other collection
> db[collection].find()
> db.dropDatabase() // ! CAUTION: There is no undo command !
> exit
```

## Mongoose
