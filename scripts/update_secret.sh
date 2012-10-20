#!/bin/bash
# shell scripting
# author: gopinath

echo "Enter API key: "
read apiKey
echo "Enter API Secret : "
read apiSecret
echo "Enter user token : "
read userToken
echo "Enter use secret : "
read userSecret

mv ../modules/linkedin.js ../modules/linkedin.js.tmp
sed "s/API_KEY/$apiKey/g" ../modules/linkedin.js.tmp > ../modules/linkedin.js.tmp
sed "s/SECRET_KEY/$apiSecret/g" ../modules/linkedin.js.tmp > ../modules/linkedin.js.tmp
sed "s/USER_TOKEN/$userToken/g" ../modules/linkedin.js.tmp > ../modules/linkedin.js.tmp
sed "s/USER_SECRET/$userSecret/g" ../modules/linkedin.js.tmp > ../modules/linkedin.js
rm ../modules/linkedin.js.tmp 



