require("dotenv").config();
const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");
const userControl = require("./user.controller");
const db = require("../config/db.config");
const { post, user, comment } = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");

exports.createComment = async (req, res) => {
  try {
    if (!req.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty!"))
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

      let new_comment = {
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        comment: req.body?.comment,
      };

      const data = await comment.create(new_comment);

      if (data) {
        const commentCount = await comment.count({where: {post_id: req.body?.post_id, is_delete: 0 }});
        console.log(commentCount);
        res.status(responseCode.OK).send(responseObj.successObject("Commented successfuly!", {"commentCount": commentCount}));
      } else {
        throw { text: "Something went wrong" };
      }
    }
  } catch (err) {
    console.log("error: ", err);
    res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.text ?? null, Object.keys(err).includes("text") ? null : err));
  }
};

exports.getAllComments = async (req, res) => {
  console.log('IM HERE');
  try {
    if (!req.query) {
              res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty"))
              return;
            }

    const commentData = await comment.findAll({
      subQuery: false,
      where: { post_id: req.query?.post_id, is_delete: 0 },
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
      group: ['comments.id']
    });
    res.status(responseCode.OK).send(responseObj.successObject("Success", commentData));
    return;
  } catch (err) {
    console.log("Error: ", err);
    res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.msg));
  }
};

exports.deleteComment = async (req, res) => {
  try {
    if (!req.query?.id) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("comment id not provided in query parameter as id!"))
      return;
    }

    // if (!req.decoded) {
    //   res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("UNAUTHORIZED"))
    //   return;
    // }

    // const decoded = req?.decoded;
    const commentData = await comment.findAll({ where: { id: req.query?.id, is_delete: 0 } })

    if (commentData?.length > 0) {
      console.log("commentData ", commentData);

      const data = await comment.update({ is_delete: 1 }, { where: { id: req.query?.id, is_delete: 0 } })
      if (data) {
        res.status(responseCode.OK).send(responseObj.successObject("comment deleted successfuly!"))
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong deleting the comment!"))
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("No such comment"))
      return;
    }
  } catch (err) {
    console.log("Error: ", err);
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err))
  }
}