'use strict';

require('dotenv').config();

// const errorHandler = require('./error-handlers/500.js');
// const logger = require('./middleware/logger.js');

const express = require('express');
const app = express();

app.use(express.json());
// app.use(errorHandler);

 app.use('*', (req, res) => {
  res.status(200).send("HelllllO");
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
