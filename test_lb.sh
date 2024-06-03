#!/bin/bash

#Number of requests
REQUESTS = 100

URL = "http://localhost:3000"

#LOOP to send requests
for ((i=1; i<=REQUESTS; i++)); do
    curl -s $URL
done

wait
echo "Requests sent successfully!"