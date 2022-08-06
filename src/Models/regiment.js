'use strict';

const regiment = (sequelize, DataTypes) => sequelize.define('Regiment', {
    DayId: {
        type: DataTypes.STRING,
        references: {
          model: 'exercise',
          key: 'id'
        }
      },
});

module.exports = regiment;