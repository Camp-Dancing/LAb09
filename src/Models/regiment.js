'use strict';

const regiment = (sequelize, DataTypes) => sequelize.define('Regiment', {
  DayId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = regiment;
