#!/usr/bin/env bash

# Set publicly available domain name (without trailing slash)
export ORIGIN=http://localhost:8081

# PostgreSQL connection
export DB_HOST=db-postgresql-sgp1-42824-do-user-12916083-0.b.db.ondigitalocean.com
export DB_USER=doadmin
export DB_PASSWORD=AVNS_w6o_w8PBxYdl3Wo8SMK
export DB_NAME=cup2022

# Used by express-session to secure the session cookies
export SESSION_SECRET=dsdadadadasdaddassd

npm start
