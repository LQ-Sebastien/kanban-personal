const { Router } = require("express");
const listController = require("../controllers/listController");
const cw = require("./controllerErrorWrapper");

const router = new Router();

router.get("/lists", cw(listController.getAllLists));
router.get("/lists/:id", cw(listController.getOneList));
router.post("/lists", cw(listController.createList));
router.patch("/lists/:id", cw(listController.updateList));
router.delete("/lists/:id", cw(listController.deleteList));

module.exports = router;
