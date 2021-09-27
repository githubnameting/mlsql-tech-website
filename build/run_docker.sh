#!/usr/bin/env bash

docker stop mlsql-site
docker rm mlsql-site

docker run -p 4000:80 --name mlsql-site -d mlsql-site