require("dotenv").config();
const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");
const userControl = require("./user.controller");
const db = require("../config/db.config");
const { post, user } = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");

exports.createPost = async (req, res) => {
  try {
    if (!req.body) {
      throw { text: "Content cannot be empty!" };
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { status: responseCode.BADREQUEST, text: errors?.errors[0]?.msg };
    }

    if (req?.decoded) {
      const decoded = req?.decoded;

      let img = "";
      if (req?.files["media"]) {
        img = await uploadFile(req, res);
        console.log("Image: ", img);
        if (img.length == 0) {
          throw { text: "Something went wrong uploading the image" };
        } else {
          img = img[0]?.name;
        }
      }

      let new_post = {
        user_id: decoded?.id,
        media: img,
        description: req.body?.description,
        tag: req.body.tag,
        visibility: req.body.visibility,
      };

      if (req.body?.location) {
        new_post["location"] = req.body?.location;
      }

      const data = await post.create(new_post);

      if (data) {
        const return_data = data?.dataValues;
        if (return_data?.media?.length > 0) {
          return_data["media"] = process.env.UPLOAD_URL + "/posts/" + return_data?.media;
        }

        res.status(responseCode.OK).send(responseObj.successObject("Success", return_data));
      } else {
        throw { text: "Something went wrong while creating post" };
      }
    }
  } catch (err) {
    console.log("error: ", err);
    res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.text ?? null, Object.keys(err).includes("text") ? null : err));
  }
};

exports.getAllPosts = async (req, res) => {
  console.log('IM HERE');
  try {
    const postData = await post.findAll({
      subQuery: false,
      where: { is_delete: 0 },
      attributes: {
        exclude: ["is_delete", "is_testdata", "created_at", "updated_at"]
      },
      include: [
        {
          model: user,
          as: "user",
          where: { is_delete: 0 },
          attributes: ['id', 'user_name', 'profile'],
          required: false,
        }
      ],
      group: ['posts.id']
    });
    console.log('postDatapostDatapostData', postData);
    res.status(responseCode.OK).send(responseObj.successObject("Success", postData));
    return;
    // res.send(postData);
  } catch (err) {
    console.log("Error: ", err);
    res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.msg));
  }
};

exports.updatePost = async (req, res) => {
  try {
    if (!req.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty"))
      return;
    }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("UNAUTHORIZED"))
      return;
    }

    const decoded = req?.decoded;
    const postData = await post.findAll({ where: { id: req.body?.post_id, user_id: decoded?.id, is_delete: 0 } })

    if (postData?.length > 0) {
      console.log("post data: ", postData);

      let updateData = {}

      if (req.files['media']) {
        const img = await uploadFile(req, res);
        if (img.length > 0) {
          updateData['media'] = img[0]?.name;
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong trying to upload the post media!"))
          return;
        }
      }

      if (req.body?.description) {
        updateData['description'] = req.body?.description
      }

      if (Object.keys(updateData).length > 0) {
        console.log("updateData: ", updateData);
        const updated = post.update(updateData, { where: { id: req.body?.post_id, user_id: decoded?.id, is_delete: 0 } })

        if (updated) {
          res.status(responseCode.OK).send(responseObj.successObject("post updated successfuly!"))
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject())
        }
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject())
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("No such post"))
      return;
    }
  } catch (err) {
    console.log("Error: ", err);
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err))
  }
}

exports.deletePost = async (req, res) => {
  try {
    if (!req.query?.id) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Post id not provided in query parameter as id!"))
      return;
    }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("UNAUTHORIZED"))
      return;
    }

    const decoded = req?.decoded;
    const postData = await post.findAll({ where: { id: req.query?.id, user_id: decoded?.id, is_delete: 0 } })

    if (postData?.length > 0) {
      console.log("post data: ", postData);

      const data = await post.update({ is_delete: 1 }, { where: { id: req.query?.id, user_id: decoded?.id, is_delete: 0 } })
      if (data) {
        res.status(responseCode.OK).send(responseObj.successObject("post deleted successfuly!"))
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong deleting the post!"))
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("No such post"))
      return;
    }
  } catch (err) {
    console.log("Error: ", err);
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err))
  }
}