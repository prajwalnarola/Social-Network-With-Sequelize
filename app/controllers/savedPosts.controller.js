require("dotenv").config();
const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");
const userControl = require("./user.controller");
const db = require("../config/db.config");
const { post, user, like, savedPosts } = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");

exports.createSavedPosts = async (req, res) => {
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

      const postData = await post.findAll({ where: { id: req.body?.post_id, is_delete: 0 } })

      if (postData?.length > 0) {
        console.log("post data: ", postData);

        const savedPostData = await savedPosts.findAll({ where: { post_id: req.body?.post_id, user_id: decoded.id, is_delete: 0 } })

        if(savedPostData.length == 0){

            let new_Savedpost = {
                user_id: decoded?.id,
                post_id: req.body?.post_id
              };
        
              const data = await savedPosts.create(new_Savedpost);
        
              if (data) {
                const savedPostsCount = await savedPosts.count({where: {user_id: decoded?.id, is_delete: 0 }});
                console.log(savedPostsCount);
                res.status(responseCode.OK).send(responseObj.successObject("post saved successfuly!", {"savedPostsCount":savedPostsCount}));
               } else {
                throw { text: "Something went wrong!" };
              }
          }else {
            res.status(responseCode.BADREQUEST).send(responseObj.failObject("Post already saved!"))
            return;
          }
        }else {
            res.status(responseCode.BADREQUEST).send(responseObj.failObject("No such post"))
            return;
          }     
    }
  } catch (err) {
    console.log("error: ", err);
    res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.text ?? null, Object.keys(err).includes("text") ? null : err));
  }
};

exports.getSavedPosts = async (req, res) => {
    console.log('IM HERE');
    try {
      const savedPostsData = await savedPosts.findAll({
        subQuery: false,
        where: { is_delete: 0 },
        attributes: {
          exclude: ["is_delete", "is_testdata", "created_at", "updated_at"]
        },
        include: [
          {
            model: post,
            as: "post",
            where: { is_delete: 0 },
            attributes: ['user_id', 'media', 'description', 'tag', 'location'],
            required: false,
          }
        ],
        group: ['savedPosts.id']
      });
      res.status(responseCode.OK).send(responseObj.successObject("Success", savedPostsData));
      return;
      // res.send(postData);
    } catch (err) {
      console.log("Error: ", err);
      res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.msg));
    }
  };

  exports.removeSavedPosts = async (req, res) => {
    try {
      if (!req.query) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Post id not provided in query parameter as id!"))
        return;
      }
  
      if (!req.decoded) {
        res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("UNAUTHORIZED"))
        return;
      }
  
      const decoded = req?.decoded;
      const savedPostsData = await savedPosts.findAll({ where: { post_id: req.query?.post_id, user_id: decoded?.id, is_delete: 0 } })
  
      if (savedPostsData?.length > 0) {
        console.log("saved post data: ", savedPostsData);
  
        const data = await savedPosts.update({ is_delete: 1 }, { where: { post_id: req.query?.post_id, user_id: decoded?.id, is_delete: 0 } })
        if (data) {
          res.status(responseCode.OK).send(responseObj.successObject("savedPost removed successfuly!"))
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
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
  

