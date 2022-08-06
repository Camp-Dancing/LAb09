'use strict';

const exercise = (sequelize, DataTypes) => sequelize.define('Exercise', {
  exercise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  runTime: {
    type: DataTypes.INTEGER,
  },
  warmupTime: {
    type: DataTypes.INTEGER,
  }
});

module.exports = exercise;