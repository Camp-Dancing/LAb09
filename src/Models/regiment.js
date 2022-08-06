'use strict';

const regiment = (sequelize, DataTypes) => sequelize.define('Regiment', {
  Monday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Tuesday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Wednesday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Thursday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Friday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Saturday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Sunday: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = regiment;