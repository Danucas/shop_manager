#!/usr/bin/env bash

mkdir -p mssql_data
sudo chgrp -R 0 mssql_data
sudo chmod -R g=u mssql_data