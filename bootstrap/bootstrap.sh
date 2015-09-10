#!/usr/bin/env bash

## node.js, git, php > 5.5, apache should be installed.

# Use single quotes instead of double quotes to make it work with special-character passwords
DB_PASSWORD='your_password'
PROJECTFOLDER='myproject'
SEARCH_API='your_host' # http://localhost:8080

## 1)
# initial steps
# sudo git clone https://github.com/masimo/myway "${PROJECTFOLDER}"
# ran from command line 
# sh bottstrap.sh

# setup hosts file
ENV="APP_ENV=local
APP_DEBUG=true
APP_API_URL=${SEARCH_API}
APP_KEY=bVRPdWEdxVDrEIr0loTAxkSM449rz7vG

DB_HOST=localhost
DB_DATABASE=myway
DB_USERNAME=root
DB_PASSWORD=${DB_PASSWORD}

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_DRIVER=sync

MAIL_DRIVER=smtp
MAIL_HOST=mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null"
echo "${ENV}" > .env

# install Composer
curl -s https://getcomposer.org/installer | php
#mv composer.phar /usr/local/bin/composer

# go to project folder, load Composer packages
php composer.phar install --dev

#install npm dependencies
npm install

# writing rights to public folders
sudo chmod 0777 -R "public/css"
sudo chmod 0777 -R "public/js"

#Compile resourcess
gulp

# final feedback
echo "Юуху!"