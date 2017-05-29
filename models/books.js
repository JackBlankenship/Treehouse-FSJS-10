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
        },
        len: {
          args:[5, 100],
          msg: "Title must be at least 5 characters"
        }
      }
    }, 
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author is required"
        },
        len: {
          args:[5, 50],
          msg: "Author must be at least 5 characters"
        }
      }
    }, 
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        },
        len: {
          args:[5, 25],
          msg: "Genre must be at least 5 characters"
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