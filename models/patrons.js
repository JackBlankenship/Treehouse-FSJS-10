'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('Patrons', {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING,
       validate: {
        notEmpty: {
          msg: "First Name is required"
        },
        len: {
          args:[5, 35],
          msg: "First name must be between 5 and 35 characters"
        }
      }
    }, 
    last_name: {
      type: DataTypes.STRING,
       validate: {
        notEmpty: {
          msg: "Last Name is required"
        },
        len: {
          args:[5, 35],
          msg: "Last name must be between 5 and 35 characters"
        }

      }
    }, 
    address: {
      type: DataTypes.STRING,
       validate: {
        notEmpty: {
          msg: "Address is required"
        },
        len: {
          args:[5, 35],
          msg: "Address must be between 5 and 35 characters"
        }

      }
    }, 
    email: {
      type: DataTypes.STRING,
       validate: {
        notEmpty: {
          msg: "Email is required"
        },
        isEmail :{
          msg: "Must be a valid Email format"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
       validate: {
        notEmpty: {
          msg: "Library ID is required"
        }
      }
    },  
    zip_code: {
      type:DataTypes.INTEGER,
       validate: {
        isInt: {
          msg: "Zip code is required"
        }
      }
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
  console.log("Create Table Patrons");
  return Patrons;
};