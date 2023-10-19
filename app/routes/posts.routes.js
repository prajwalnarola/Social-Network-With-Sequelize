// INPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/posts.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post("/create", [validator.validateCreatePost], controller.createPost);
Router.get("/all", [], controller.getAllPosts);
Router.put('/update', [], controller.updatePost)
Router.delete('/delete', [], controller.deletePost)

module.exports = Router;
