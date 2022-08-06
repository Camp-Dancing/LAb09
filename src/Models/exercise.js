'use strict';

const exercise = (sequelize, DataTypes) => sequelize.define('Exercise', {
  exercise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardioTime: {
    type: DataTypes.INTEGER,
  },
  stretchTime: {
    type: DataTypes.INTEGER,
  }
});

module.exports = exercise;
