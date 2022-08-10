'use strict';

/// Exports a function that, when called, defines a new exercise
const exerciseSchema = (sequelize, DataTypes) => {
  return sequelize.define('Exercise', {
    exercise: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardioTime: {
      type: DataTypes.INTEGER,
    },
    stretchTime: {
      type: DataTypes.INTEGER,
    },
  });
};

module.exports = exerciseSchema;
