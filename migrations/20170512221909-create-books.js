'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    console.log("Migration createTable Books");
    return queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      first_published: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    console.log("Migration drop table Books");
    return queryInterface.dropTable('Books');
  }
};