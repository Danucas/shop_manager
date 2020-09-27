#!/bin/sh

SQL_HOST=sqlserver
SQL_PORT=1433

while nc -z $SQL_HOST $SQL_PORT; do
	sleep 0.1
done
sleep 12s

exec "$@"