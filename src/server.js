'use strict';

require('dotenv').config();

// const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger');

const express = require('express');
const { signinUser, signupUser } = require('./middleware/auth/route');
const userModel = require('./Models/users');
const { Sequelize, DataTypes } = require('sequelize');
const Collection = require('./data');
const validateToken = require('./middleware/auth/auth');

const app = express();

/// Database

const db = new Sequelize('sqlite::memory:', {});

userModel(db, DataTypes);

/// Middleware

app.use(express.json());
app.use(logger);

/// auth

app.use(validateToken);

app.put('/signup', signupUser);
app.post('/signin', signinUser);

/// Routes
app.use('*', (req, res) => {
  res.status(200).send('HelllllO');
});

module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
