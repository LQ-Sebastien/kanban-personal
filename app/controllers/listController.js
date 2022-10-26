const sanitizeHtml = require("sanitize-html");
const { List, Card } = require("../models");

async function getAllLists(req, res) {
  const lists = await List.findAll({
    order: [
      ["position", "ASC"],
      ["created_at", "DESC"],
      [ { model: Card, as: "cards" }, "position", "ASC"]
    ],
    include: {
      association: "cards",
      include: "tags",
    }
  });
  res.json(lists);
}

async function getOneList(req, res) {
  const listId = parseInt(req.params.id);

  if( isNaN(listId) ) {
    res.status(404).json({ error: "List not found. Please verify the provided id." });
    return;
  }

  const list = await List.findByPk(listId);

  if (! list) { 
    res.status(404).json({ error: "List not found. Please verify the provided id." });
    return;
  }

  res.json(list);
}

async function createList(req, res) {
  const { name, position } = req.body;

  if (position && isNaN(position)) {
    return res.status(400).json({ error: "Invalid type: position should be a number" });
  }

  if (! name) {
    return res.status(400).json({ error: "Missing body parameter: name" });
  }

  const list = await List.create({
    name: sanitizeHtml(name),
    position
  });

  res.status(201).json(list);
}

async function updateList(req, res) {
  // Extract params & body
  const listId = parseInt(req.params.id);
  const { name, position } = req.body;

  // Verify user inputs
  if (! name && ! position) {
    return res.status(400).json({ error: "Invalid body. Should provide at least a 'name' or 'position' property" });
  }

  if (position && isNaN(position)) {
    return res.status(400).json({ error: "Invalid body parameter 'position'. Should provide a number." });
  }

  // Fetch from Database
  const list = await List.findByPk(listId);
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  console.log(name);

  // Update Database
  if (name) {
    list.name = sanitizeHtml(name);
  }
  if (position) {
    list.position = parseInt(position);
  }
  await list.save();

  // Return response
  res.json(list);
}

async function deleteList(req, res) {
  // Extract params & body
  const id = parseInt(req.params.id);

  // Fetch from Database
  const list = await List.findByPk(id);
  if (! list) {
    return res.status(404).json({ error: "List not found. Please verify the provided id." });
  }

  // Update Database
  await list.destroy();

  // Return response
  res.status(204).end();
}


module.exports = {
  getAllLists,
  getOneList,
  createList,
  updateList,
  deleteList
};
