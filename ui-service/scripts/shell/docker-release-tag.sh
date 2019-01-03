#!/bin/sh

TAG_NUMBER="latest"

if [ "$1" != "" ]; then
    TAG_NUMBER="$1";
fi

echo "Releasing ui-service with tag=$TAG_NUMBER"

docker build -t notes-app_ui-service:$TAG_NUMBER . &&
docker tag notes-app_ui-service:$TAG_NUMBER arturjs/notes-app_ui-service:$TAG_NUMBER &&
docker push arturjs/notes-app_ui-service:$TAG_NUMBER

echo "Done!"
