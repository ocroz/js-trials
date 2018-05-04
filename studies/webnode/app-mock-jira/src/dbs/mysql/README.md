# MySQL database

## MySQL installation

Download and install Windows msi from https://dev.mysql.com/downloads/mysql/.

- Keep all the default options, but
- Don't start MySQL as a Windows Service.

Update the PATH with:
- "C:\Program Files\MySQL\MySQL Server 8.0\bin", and
- "C:\Program Files\MySQL\MySQL Shell 8.0\bin".

## Start MySQL daemon

Source: https://dev.mysql.com/doc/refman/8.0/en/data-directory-initialization-mysqld.html

First kill all the mysqld processes in the Windows Task Manager.

Create a mysql config file.

```
[mysqld]
datadir = ./src/dbs/mysql/db
port = 52401
```

Create the mysql server and get the <i>temporary password</i>.<br />
Note: The basedir must be empty.

```
$ mysqld --defaults-file=src/dbs/mysql/my-opts.cnf --initialize --console
[Server] A temporary password is generated for root@localhost: zohBt09CSj.Q
```

Start the server.

```
$ mysqld --defaults-file=src/dbs/mysql/my-opts.cnf &
```

Change the temporary password.

```
$ export MYSQL_PS1="mysql (\u@\h) [\d]> "
$ mysql --port 52401 -h localhost -u root -p
Enter password: ********
mysql (root@localhost) [(none)]> ALTER USER root@localhost IDENTIFIED BY '';
mysql (root@localhost) [(none)]> SHOW VARIABLES WHERE Variable_Name LIKE "%dir" ;
mysql (root@localhost) [(none)]> quit
```

## Create database

```bash
d=src/dbs/mysql/scripts
for f in $(ls $d);do \
  mysql --port 52401 -h localhost -u root -p --verbose --force < $d/$f; \
done
```

## MySQL shell

```
$ mysqlsh
> \help
> \sql // Switch to sql or \js for javascript
> \c root@localhost // connect to local server as root
> SHOW DATABASES;
> \use world
> SHOW TABLES;
> DESCRIBE country;
> SELECT count(*) FROM country;
> SELECT Name,Continent,SurfaceArea,Population,LocalName,Capital FROM country;
> \quit
```
