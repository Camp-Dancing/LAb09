'use strict';

const regiment = (sequelize, DataTypes) => sequelize.define('Regiment', {
    DayId: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    references: {
            cardioTime: 15,
            stretchTime: 10
          }
         
});

module.exports = regiment;