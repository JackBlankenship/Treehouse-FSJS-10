'use strict';
module.exports = function(sequelize, DataTypes) {
  var Books = sequelize.define('Books', {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
       validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    }, 
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    }, 
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        }
      }
    }, 
    first_published: {
      type:DataTypes.INTEGER
    }
   }, 
   { timestamps: false },
   {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      // functionName: function () {
      //  return something
      //}
    }
  });
  console.log("Create Table Books");
  return Books;
};