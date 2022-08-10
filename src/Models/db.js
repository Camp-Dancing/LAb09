'use strict';

require('dotenv').config();
const userSchema = require('./users.js');
const exerciseSchema = require('./exercise');

// const DATABASE_URL = ['dev', 'test'].includes(process.env.NODE_ENV)
const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory:'
  : process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');



const baseOptions =
  process.env.NODE_ENV === 'test'
    ? {
      logQueryParameters: true,
      logging: (...args) => args,  //console.log(...args),
    }
    : {
      logging: () => {},
    };

const sequelizeOptions = {
  ...baseOptions,
  ...(process.env.NODE_ENV === 'production'
    ? {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
    : {}),
};

// 

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const userModel = userSchema(sequelize,DataTypes);
const exerciseModel = exerciseSchema(sequelize,DataTypes);

module.exports = {
  db: sequelize,
  userModel,
  exerciseModel,
};
