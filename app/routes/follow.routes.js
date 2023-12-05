// INPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/follow.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post("/create-follower", [], controller.followers);
Router.post("/create-following", [], controller.following);
Router.get("/all-followers", [], controller.getFollowers);
Router.get("/all-following", [], controller.getFollowing);
Router.delete('/unfollow', [], controller.unfollow);


module.exports = Router;
