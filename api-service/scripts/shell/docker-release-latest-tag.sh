#!/bin/sh

docker build -t notes-app_api-service:latest . &&
docker tag notes-app_api-service:latest arturjs/notes-app_api-service:latest &&
docker push arturjs/notes-app_api-service:latest
