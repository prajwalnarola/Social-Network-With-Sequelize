// INPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/story.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post("/create", [], controller.createStory);
Router.get("/all", [], controller.getStory);
Router.put('/like', [], controller.likeStory);
Router.delete('/delete', [], controller.deleteStory);
Router.post("/getViewers",[], controller.createStoryViewers);

module.exports = Router;
