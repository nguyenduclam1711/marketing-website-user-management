# DCI marketing website

[![Build Status](https://travis-ci.org/DigitalCareerInstitute/marketing-website.svg?branch=master)](https://travis-ci.org/DigitalCareerInstitute/marketing-website)

![Screenshot](screenshot.png)

## Architecture:

NodeJs/Express/Passport/Pug/Redis, React in the backend

[Live version](https://digitalcareerinstitute.org)  

## Installation:

1. Install `NodeJS/npm`
1. Install `MongoDB`
1. Install caching `Redis`. [Install info](https://redis.io/download#installation)
1. copy the `.env.example` to `.env` and fill in the neccessary secret keys (you get them from an admin): ``
1. It can happend that it complains about a missing global `webpack` and `webpack-cli`. Just install them global: `npm i webpack webpack-cli -g`


#### Example .env:
```
PORT=3000
MONGOURL=mongodb://localhost:27017/marketing-website
DOMAIN=localhost
EVENTBRIDE_API_KEY=XXXXXXXXXXXXXXXXXXXX
MAILHOST=XXXXXX.XXXXXXXXXX.com
MAILUSER=XXXXXXXXXXXX
MAILPW=XXXXXXXXXXXXXX
MAILPORT=587
MAILRECEIVER=developer@digitalcareerinstitute.org
TOURMAILRECEIVER=developer@digitalcareerinstitute.org
IMAGE_UPLOAD_DIR=uploads/images/
USE_REDIS=true
AUTHORIZATION='auth xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us14'
URL='https://us14.api.mailchimp.com/3.0/lists/xxxxxxxxxx'
CRONINTERVAL="0 0 * * *"
CLIENT_ID="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CLIENT_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
SESSION_KEY=digitalcareerinstitute
SESSION_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

```

## Run the app

Start normal: `npm start`  
Start development: `npm run dev`

## Insert example data in database

##### Create a few Stories and Menulocations in the selected DB.

Insert example data:  
`npm run seed`

Remove all seeds from database:  
`npm run seed:delete`

## Contribution
Check out the [Issues](https://github.com/DigitalCareerInstitute/marketing-website/issues) for a `good first issue`.
And read  the [Contribution Guidelines](https://github.com/digitalcareerinstitute/marketing-website/CONTRIBUTION.md)


## Run in docker dev environment  
`docker-compose up`

## Deployment
In the private [infrastructure repo](https://github.com/DigitalCareerInstitute/infrastructure) we manage the deployment and the server provision per [Ansible](https://www.ansible.com/). If you need to deploy, require ssh access to the live environment from an admin.
