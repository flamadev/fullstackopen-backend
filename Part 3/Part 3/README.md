Full Stack Open- Exercise Solutions - Phonebook

Part 3 - Programming a server with NodeJS and Express

This repository contains a working solution to the Part 3 backend exercise written with node and express.js

The build folder contains production ready ui built with react in Part 2 of the course

# Solutions for Part 3 exercises

In this part our focus shifts towards the backend, that is, towards implementing functionality on the server side of the stack. We will implement a simple REST API in Node.js by using the Express library, and the application's data will be stored in a MongoDB database. At the end of this part, we will deploy a `phonebook` application to the internet.

## Phonebook API

In this exercise, we implemented a fullstack phonebook app with a backend written in Node.js and a frontend in react.js. The data are saved in a mongodb database and the app is deployed on heroku at the following URL.

- (https://fullstackopen-backend-phonebook-dev-brmx.1.ie-1.fl0.io/)

### Start the application locally

To start an application:

```bash
# Install dependencies
$ npm install

# Create a .env file and put there the MONGODB_URI for connecting to your mongodb database
$ echo "MONGODB_URI=<YOUR-MONGODB-URI>" > .env

# Start the application
$ npm run dev
```

You can then access the app on : http://localhost:3001/