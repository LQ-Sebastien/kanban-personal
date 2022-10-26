const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class List extends Model {}

List.init({
  name: {
    type: DataTypes.TEXT
  },
  position: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  tableName: "list"
});

module.exports = List;
