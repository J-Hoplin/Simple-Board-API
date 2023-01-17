#!/bin/zsh

envParser(){
  local varLocation=$1
  while read line; 
  do
    if [[ -z $(echo ${line} | grep "#" ) ]]; then
        eval "${line}"
    fi
  done < ${varLocation}
}


envParser $(pwd)/.env

# Stop and remove container
echo "Terminating API container..."
docker stop $CNAME_API && docker rm $CNAME_API > /dev/null
echo "Terminating Redis Container..."
docker stop $CNAME_REDIS && docker rm $CNAME_REDIS > /dev/null
echo "Terminating DB Container ..."
docker stop $CNAME_DB && docker rm $CNAME_DB > /dev/null
# Remove network
echo "Removing network"
docker network rm $NETWORK_NAME