// INPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/savedPosts.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post("/create", [], controller.createSavedPosts);
Router.get("/all", [], controller.getSavedPosts);
Router.delete('/delete', [], controller.removeSavedPosts);


module.exports = Router;
