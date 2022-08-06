'use strict';

const regiment = (sequelize, DataTypes) => sequelize.define('Regiment', {
    DayId: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    references: {
            exercise: 'exercise',
            cardioTime: 'cardioTime',
            stretchTime: 'stretchTime'
          } 
});

module.exports = regiment;