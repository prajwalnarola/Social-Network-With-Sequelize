require("dotenv").config();
var nodemailer = require("nodemailer");
const ejs = require("ejs");
const { validationResult } = require("express-validator");
const { Sequelize, Op } = require("sequelize");

const db = require("../config/db.config"); // models path
const { user, post, userProfile } = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");
const uploadFile = require("../utils/uploadFile");
const helperFunctions = require("../utils/helperFunctions")


// find user logic
exports.findUser = (data) => {
  return new Promise((resolve, reject) => {
    user.findAll({
      where: { email: data },
      attributes: {
        exclude: ["created_at", "updated_at", "is_testdata", "is_delete"]
      }
    }).then((result) => {
      try {
        if (result && result.length > 0) {
          resolve({
            status: 1,
            message: "data found",
            data: result,
          });
        } else {
          // resolve(0);
          resolve({ status: 2, message: "No data found" });
        }
      } catch (err) {
        resolve({
          status: 0,
          message: "Error occurred while fetching User",
        });
      }
    });
  });
};

exports.findUserById = (data) => {
  return new Promise((resolve, reject) => {
    user.findAll({ where: { id: data }, attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] } }).then((result) => {
      try {
        if (result) {
          resolve({
            status: 1,
            message: "data found",
            data: result,
          });
        } else {
          resolve(0);
          resolve({ status: 2, message: "No data found" });
        }
      } catch (err) {
        resolve({
          status: 0,
          message: "Error occurred while fetching User",
        });
      }
    });
  });
};

// APIS

exports.createUserProfile = async (req, res) => {
  try {
    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    let img = "";
    if (req.files['profile']) {
      img = await uploadFile(req, res);
      console.log("Image: ", img);
      if (img.length == 0) {
        throw { text: "Something went wrong uploading the image" };
      } else {
        img = img[0]?.name;
      }
    }

    const decoded = req?.decoded;
    console.log(decoded);

    const data = await userProfile.findOne({
      where: { user_id: decoded?.id, is_delete: 0 },
    })
    console.log(data);
    if (data) {
      throw { message: "Profile is already created." };
    } 
    else {
      const create_userProfile = {
        user_id: req.body.user_id,
        full_name: req.body.full_name,
        profile: img,
        DOB: req.body.DOB,
        user_status: req.body.user_status
      };
      console.log(create_userProfile);

      const userData = await userProfile.create(create_userProfile);
      res.status(responseCode.OK).send(responseObj.successObject(
        "Profile created successfully!"
        )
      );
    }
  } catch (err) {
    if (err?.message) {
      if (Object.keys(err).length == 1) {
        res
          .status(responseCode.BADREQUEST)
          .send(responseObj.failObject(err?.message ?? null));
      } else {
        res
          .status(err?.status ?? responseCode.BADREQUEST)
          .send(
            responseObj.failObject(
              err?.message ?? null,
              err?.status ? null : err
            )
          );
      }
    } else {
      console.log("Error: ", err);
      res
        .status(responseCode.BADREQUEST)
        .send(responseObj.failObject(null, err));
    }
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    // if (!req.body) {
    //   res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty!"))
    //   return;
    // }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    const decoded = req?.decoded;

    const data = await userProfile.findAll({
      where: { user_id: decoded?.id, is_delete: 0 },
      // attributes: ['id', 'user_name', 'email', 'profile']
    })

    const no_posts = await post.count({ where: { user_id: decoded?.id, is_delete: 0 } });

    const returnData = {
      ...data[0]?.dataValues,
      postsCount: no_posts
    }

    if (data?.length > 0) {
      res.status(responseCode.OK).send(responseObj.successObject(null, returnData))
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}

exports.getUserPosts = async (req, res) => {
  try {
    // if (!req.body) {
    //   res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty!"))
    //   return;
    // }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    const decoded = req?.decoded;

    const posts = await post.findAll({
      where: { user_id: decoded?.id, is_delete: 0 },
      attributes: {
        exclude: ['user_id', 'is_delete', 'is_testdata', 'created_at', 'updated_at'],
      }
    })

    if (posts?.length > 0) {
      res.status(responseCode.OK).send(responseObj.successObject(null, posts))
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("No posts for user!"))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "narolaios@gmail.com",
    pass: "feksopjnxvwbbzgf",
  },
});

// send mail logic
exports.sendMail = async (template_name, options, data) => {
  return new Promise((resolve, reject) => {
    let emailTemplate;
    ejs
      .renderFile(constants.TEMPLATE_PATHS.FORGOT_PASS, {
        reset_link: options.reset_link,
        user_name: options.user_name,
      })
      .then((result) => {
        emailTemplate = result;
        const mailOptions = {
          from: "narolaios@gmail.com", // sender address
          to: options.to, // list of receivers
          subject: options.subject, // Subject line
          html: emailTemplate, // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            resolve({ status: 0, error: error });
          } else {
            resolve({ status: 1, message: info });
          }
        });
      });
  });
};

exports.sendVerificationMail = async (options, data) => {
  return new Promise((resolve, reject) => {
    let emailTemplate;
    ejs
      .renderFile(constants.TEMPLATE_PATHS.VERIFY_EMAIL, {
        verify_link: options.verify_link,
        user_name: options.user_name,
        email: options.email,
      })
      .then((result) => {
        emailTemplate = result;
        const mailOptions = {
          from: "narolaios@gmail.com", // sender address
          to: options.to, // list of receivers
          subject: options.subject, // Subject line
          html: emailTemplate, // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            resolve({ status: 0, error: error });
          } else {
            resolve({ status: 1, message: info });
          }
        });
      })
      .catch((err) => {
        console.log("sendVerificationMail Error: ", err);
      });
  });
};

exports.updateUser = async (req, res) => {
  try {
    if (!req?.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"))
      return;
    }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    const decoded = req?.decoded;

    let updated_user = {};
    let img;
    if (req.files['profile']) {
      img = (await uploadFile(req, res))[0]?.name
    }

    if (img) {
      updated_user["profile"] = img;
    }

    if (req.body?.name) {
      updated_user['user_name'] = req.body?.name
    }

    if (updated_user) {
      const data = await user.update(updated_user, { where: { id: decoded?.id, is_delete: 0 } });

      if (data) {
        res.status(responseCode.OK).send(responseObj.successObject())
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong updating the user profile!"))
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong! No data to update."))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}

exports.updateProfile = async (req, res) => {
  try {
    if (!req?.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"))
      return;
    }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    const decoded = req?.decoded;

    let updated_user = {};
    let img;
    if (req.files['profile']) {
      img = (await uploadFile(req, res))[0]?.name
    }

    if (img) {
      updated_user["profile"] = img;
    }

    if (req.body?.full_name) {
      updated_user['full_name'] = req.body?.full_name
    }

    if (updated_user) {
      const data = await userProfile.update(updated_user, { where: { user_id: decoded?.id, is_delete: 0 } });

      if (data) {
        res.status(responseCode.OK).send(responseObj.successObject("profile updated successfuly!"))
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong updating the user profile!"))
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong! No data to update."))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}

exports.changePassword = async (req, res) => {
  try {
    if (!req?.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"))
      return;
    }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    const decoded = req?.decoded;

    const user_data = await this.findUserById(decoded?.id);

    if (user_data?.status == 1) {
      const is_password_verified = helperFunctions.verifyPassword(req.body?.old_password, user_data?.data[0]?.password);
      if (is_password_verified) {
        const new_password = helperFunctions.hashPassword(req.body?.new_password);

        const data = await user.update({ password: new_password }, { where: { id: decoded?.id } });

        if (data[0] == 1) {
          res.status(responseCode.OK).send(responseObj.successObject("password changed successfuly!"))
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong updating the password!"))
        }
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Incorrect Password!"))
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("No such user found!"))
    }

  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}
