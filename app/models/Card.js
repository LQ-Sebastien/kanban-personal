const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Card extends Model {}

Card.init({
  content: {
    type: DataTypes.TEXT
  },
  position: {
    type: DataTypes.INTEGER 
  },
  color: {
    type: DataTypes.TEXT 
  }
}, {
  sequelize, 
  tableName: "card"
});

module.exports = Card;
