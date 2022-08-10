'use strict';
/// this is the server file it sets up all the routes for the server.
require('dotenv').config();

// const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger');

const express = require('express');
const { signinUser, signupUser } = require('./middleware/auth/route');
// const user = require('./Models/users');

const Collection = require('./data');
const notFound = require('./error-handlers/404');
const handleError = require('./error-handlers/500');
const validateToken = require('./middleware/auth/auth');
const { exerciseModel, userModel } = require('./Models/db');

const app = express();


app.use(express.json());
app.use(logger);


app.use(validateToken);


new Collection(exerciseModel, app);
new Collection(userModel, app);

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
