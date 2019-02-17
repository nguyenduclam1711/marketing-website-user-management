# DCI marketing website

[![Build Status](https://travis-ci.org/DigitalCareerInstitute/marketing-website.svg?branch=master)](https://travis-ci.org/DigitalCareerInstitute/marketing-website)

![Screenshot](screenshot.jpg)

## Architecture:

NodeJs/Express/Passport/Pug

## Online

[Live](https://digitalcareerinstitute.org)  
[Staging](https://dci.tmy.io/)

## Installation:

1. Install `NodeJS/npm`
1. Install `MongoDB`
1. copy the `.env.example` to `.env` and put your secrets there.

#### Example .env:

```
PORT=3000
MONGOURL=mongodb://localhost:27017/marketing-website
DOMAIN=/
```

## Run the app

Start normal: `npm start`  
Start development: `nodemon index.js`

## Insert optional example data

##### Create a few Stories and Categories in the selected DB.

Run seed script:  
`npm run seed`

Run the `seed:delete` script:  
`npm run seed:delete`


## Run in docker dev environment
`docker-compose up`