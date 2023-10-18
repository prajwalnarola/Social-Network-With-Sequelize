const { check, param, query } = require("express-validator");
// THIS IS VALIDATION FILE IN WHICH WE HAVE PUT ALL THE VALIDATION.
// HERE ARE THE ONLY FEW VALIDATIONS BUT IF MORE VALIDATIONS THE BEST PRACTISE IS TO CREATE DIFFRENT FILES FOR VALIDATIONS AND BIND IT IN ONE INDEX FILE.

exports.validateLogin = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("password").notEmpty().withMessage("password field is required!"),
];

exports.validateRegister = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("name").notEmpty().withMessage("name field is required!"),
  check("password").notEmpty().withMessage("password field is required!"),
];

exports.validateForgotPassword = [
  check("email").isEmail().withMessage("email field is required with a valid email!")
];

exports.validateCreatePost = [
  check("description").notEmpty().withMessage("description is required!")
];

exports.validateChangePassword = [
  check("old_password").notEmpty().withMessage("old_password field is required!"),
  check("new_password").notEmpty().withMessage("new_password field is required!")
];