'use strict';

require('dotenv').config();

// const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger');

const express = require('express');
const { signinUser, signupUser } = require('./middleware/auth/route');
const userModel = require('./Models/users');
const { Sequelize, DataTypes } = require('sequelize');
const Collection = require('./data');
const notFound = require('./error-handlers/404');
const handleError = require('./error-handlers/500');



const validateToken = require('./middleware/auth/auth');
const exercise = require('./Models/exercise');

const app = express();

/// Database

const db = new Sequelize('sqlite::memory:', {});


const exerciseModel = exercise(db, DataTypes);
userModel(db, DataTypes);


/// Middleware

app.use(express.json());
app.use(logger);

/// auth

app.use(validateToken);

new Collection(exerciseModel, app);

app.put('/signup', signupUser);
app.post('/signin', signinUser);

/// Routes
app.use('*', notFound);
app.use(handleError);

module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
