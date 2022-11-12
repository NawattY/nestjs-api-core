#!/bin/bash
PATH=/root/.nvm/versions/node/v16.17.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games

export NODE_OPTIONS=--max-old-space-size=8192

cd /data/vhosts/smart-restaurant-api/
#export env to .env
 echo >.env
 echo "APP_NAME=$APP_NAME" >>.env
 echo "APP_URL=$APP_URL" >>.env
 echo "APP_PORT=$APP_PORT" >>.env
 echo "APP_HOST=$APP_HOST" >>.env
 
 echo "POSTGRES_HOST=$POSTGRES_HOST" >> .env
 echo "POSTGRES_PORT=$POSTGRES_PORT" >> .env
 echo "POSTGRES_DATABASE=$POSTGRES_DATABASE" >> .env
 echo "POSTGRES_USERNAME=$POSTGRES_USERNAME" >> .env
 echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
 echo "MONGO_DB_URI=$MONGO_DB_URI" >> .env

 echo "JWT_SECRET=$JWT_SECRET" >> .env

 echo "REDIS_HOST=$REDIS_HOST" >> .env
 echo "REDIS_PORT=$REDIS_PORT" >> .env
 echo "REDIS_DB=$REDIS_DB" >> .env
 echo "REDIS_CACHE_DB=$REDIS_CACHE_DB" >> .env

 echo "AWS_S3_ACCESS_KEY_ID=$AWS_S3_ACCESS_KEY_ID" >> .env
 echo "AWS_S3_SECRET_ACCESS_KEY=$AWS_S3_SECRET_ACCESS_KEY" >> .env
 echo "AWS_S3_REGION=$AWS_S3_REGION" >> .env
 echo "AWS_S3_BUCKET=$AWS_S3_BUCKET" >> .env
 echo "AWS_S3_ACL=$AWS_S3_ACL" >> .env
 echo "AWS_S3_URL=$AWS_S3_URL" >> .env
 echo "AUTH_ACCESS_TOKEN_EXPIRE_MIN=1440" >> .env
 echo "AUTH_REFRESH_TOKEN_EXPIRE_MIN=10080" >> .env 
 echo "HTTP_LOG_ENABLED=$HTTP_LOG_ENABLED" >> .env
 echo "EXCEPTION_LOG_ENABLED=$EXCEPTION_LOG_ENABLED" >> .env
 echo "AWS_CLOUDWATCH_ACCESS_KEY_ID=$AWS_CLOUDWATCH_ACCESS_KEY_ID" >> .env
 echo "AWS_CLOUDWATCH_SECRET_ACCESS_KEY=$AWS_CLOUDWATCH_SECRET_ACCESS_KEY" >> .env
 echo "AWS_CLOUDWATCH_REGION=$AWS_CLOUDWATCH_REGION" >> .env
 echo "AWS_CLOUDWATCH_LOG_GROUP_NAME=$AWS_CLOUDWATCH_LOG_GROUP_NAME" >> .env
 echo "AWS_CLOUDWATCH_LOG_STREAM_NAME=$AWS_CLOUDWATCH_LOG_STREAM_NAME" >> .env
 echo "HASH_KEY=$HASH_KEY" >> .env
 echo "MAIL_MAILER=$MAIL_MAILER" >> .env
 echo "MAIL_HOST=$MAIL_HOST" >> .env
 echo "MAIL_PORT=$MAIL_PORT" >> .env
 echo "MAIL_USERNAME=$MAIL_USERNAME" >> .env
 echo "MAIL_PASSWORD=$MAIL_PASSWORD" >> .env
 echo "MAIL_FROM=$MAIL_FROM" >> .env
 echo "PASSWORD_RESET_TOKEN_EXPIRED_MINUTES=60" >> .env
 echo "APP_BACKEND_URL=$APP_BACKEND_URL" >> .env
 echo "GOOGLE_RECAPTCHA_SECRET_KEY=$GOOGLE_RECAPTCHA_SECRET_KEY" >> .env
 echo "GOOGLE_RECAPTCHA_SCORE=0.5" >> .env
 echo "APP_FRONTEND_URL=$APP_FRONTEND_URL" >> .env


/etc/init.d/nginx restart

#npm run build
#npm run migration:run
#/etc/init.d/nginx stop
#npm run start
tail -f /dev/null
