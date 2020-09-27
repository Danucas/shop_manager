#!/usr/bin/env/bash
set -e

if [ "$1" = '/opt/mssql/bin/sqlservr' ]; then
	if [ ! -f /tmp/app-initialized ]; then

		function initialize_app_database() {
			sleep 15s

			/opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Shop_dev -d master -i setup_shop_manager.sql

			touch /tmp/app-initialized
		}
		initialize_app_database &
	fi
fi

exec "$@"