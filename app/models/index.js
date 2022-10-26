const List = require("./List");
const Card = require("./Card");
const Tag = require("./Tag");

// List <--> Card

List.hasMany(Card, {
  as: {
    singular: "card",
    plural: "cards"
  },
  foreignKey: "list_id"
});

Card.belongsTo(List, {
  as: {
    singular: "list",
    plural: "lists"
  },
  foreignKey: "list_id"
});


// Card <--> Tag

Card.belongsToMany(Tag, {
  as: "tags",
  through: "card_has_tag",
  foreignKey: "card_id",
  otherKey: "tag_id",
  timestamps: false
});

Tag.belongsToMany(Card, {
  as: "cards",
  through: "card_has_tag",
  foreignKey: "tag_id",
  otherKey: "card_id",
  timestamps: false
});

module.exports = { List, Card, Tag };
