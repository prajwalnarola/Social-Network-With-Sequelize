// INPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/comments.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post("/create", [validator.validateCreateComment], controller.createComment);
Router.get("/all", [], controller.getAllComments);
Router.delete('/delete', [], controller.deleteComment);

module.exports = Router;
