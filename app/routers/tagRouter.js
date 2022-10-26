const { Router } = require("express");
const tagController = require("../controllers/tagController");
const cw = require("./controllerErrorWrapper");

const router = new Router();

router.get("/tags", cw(tagController.getAllTags));
router.get("/tags/:id", cw(tagController.getOneTag));
router.post("/tags", cw(tagController.createTag));
router.patch("/tags/:id", cw(tagController.updateTag));
router.delete("/tags/:id", cw(tagController.deleteTag));

router.put("/cards/:cardId/tags/:tagId", cw(tagController.addTagToCard));
router.delete("/cards/:cardId/tags/:tagId", cw(tagController.removeTagFromCard));


module.exports = router;
