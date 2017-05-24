'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Must be a valid number"
        }
      }
    }, 
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Must be a valid number"
        }
      }
    }, 
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: "Must be a date format"
        }
      }
    }, 
    return_by: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: "Must be a date format"
        }
      }
    }, 
    returned_on: {
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
  console.log("Create Table Loans");
  return Loans;
};