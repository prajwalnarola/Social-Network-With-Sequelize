// INPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/user.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post('/createProfile', [], controller.createUserProfile)
Router.get('/profile', [], controller.getUserProfile)
Router.get('/posts', [], controller.getUserPosts)
// Router.get('/story', [], controller.getUserStory)
Router.put('/update-user', [], controller.updateUser)
Router.put('/update', [], controller.updateProfile)
Router.put('/change-password', [validator.validateChangePassword], controller.changePassword)

module.exports = Router;
