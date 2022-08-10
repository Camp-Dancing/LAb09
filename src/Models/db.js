'use strict';

///Database file! It handles all our database stuff
/// which includes creating the database based off of
/// environment settings, and also it creates all our
/// models (and exports them for use)

require('dotenv').config();
const userSchema = require('./users.js');
const exerciseSchema = require('./exercise');
const { Sequelize, DataTypes } = require('sequelize');

const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL;

const testSettings = {
  logQueryParameters: true,
  logging: (...args) => args, //console.log(...args),
};

const prodSettings = {
  logging: () => {},
};

const baseOptions =
  process.env.NODE_ENV === 'test' ? testSettings : prodSettings;

const secondProdSettings = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const sequelizeOptions = {
  ...baseOptions,
  ...(process.env.NODE_ENV === 'production' ? secondProdSettings : {}),
};


/// yo whats up von
/// in case DATABASE_URL doesn't exit (aka you didn't set an environment variable)
/// we have a fallback to switch to memory, and we stuck it in a function to
/// announce that the fallback is happening
const fallback = () => {
  console.log('no URL, falling back to memory');
  return 'sqlite::memory:';
};

const sequelize = new Sequelize(DATABASE_URL || fallback(), sequelizeOptions);

const userModel = userSchema(sequelize, DataTypes);
const exerciseModel = exerciseSchema(sequelize, DataTypes);



module.exports = {
  db: sequelize,
  userModel,
  exerciseModel,
};
