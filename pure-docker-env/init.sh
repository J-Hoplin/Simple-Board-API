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

# Create network
echo "Creating Network..."
docker network create --driver bridge $NETWORK_NAME > /dev/null
# Create volume
echo "Creating Volume..."
docker volume create $VOLUME_NAME > /dev/null

# Image pull

# MySQL
echo "Pulling Image : $DB_IMAGE"
docker pull $DB_IMAGE > /dev/null
# Redis
case "`uname -a`" in
  *x86_64*|*amd64*)
    echo "System CPU Architecture : x86 / amd64"
    redis_image="redis:bullseye";;
  *arm*)
    echo "System CPU Architecture : ARM"
    redis_image="arm64v8/redis";;
  *)
    echo "Unable to identify CPU architecture"
    exit 1
esac
echo "Pulling Image : $redis_image"
docker pull $redis_image > /dev/null
# Build image
echo "Build Image"
docker build -t $API_IMAGE .. > /dev/null

# Create mysql container
echo "Generating Container : DB"
docker run -d --name $CNAME_DB -p $DB_PORT:3306 -v $VOLUME_NAME:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=$db_pw -e MYSQL_ROOT_HOST="%" --network $NETWORK_NAME --network-alias $db_alias --restart=$restart_option $DB_IMAGE > /dev/null
# Create redis container
echo "Generating Container : Redis"
docker run -d --name $CNAME_REDIS -p $REDIS_PORT:6379 --network $NETWORK_NAME --network-alias $redis_alias --restart=$restart_option $redis_image > /dev/null
# Create api container
echo "Generating Container : API"
docker run -d --name $CNAME_API -p $API_PORT1:4000 -p $API_PORT2:6000 --network $NETWORK_NAME --network-alias $api_alias --restart=$restart_option $API_IMAGE > /dev/null