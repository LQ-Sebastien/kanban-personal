const { Router } = require("express");
const cardController = require("../controllers/cardController");
const cw = require("./controllerErrorWrapper");

const router = new Router();

router.get("/cards", cw(cardController.getAllCards));
router.get("/cards/:id", cw(cardController.getOneCard));
router.post("/cards", cw(cardController.createCard));
router.patch("/cards/:id", cw(cardController.updateCard));
router.delete("/cards/:id", cw(cardController.deleteCard));

router.get("/lists/:listId/cards", cw(cardController.getAllCardsOfList));

module.exports = router;
