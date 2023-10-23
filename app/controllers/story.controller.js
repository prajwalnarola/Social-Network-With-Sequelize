require("dotenv").config();
const { Op, Sequelize } = require("sequelize");
const userControl = require("./user.controller");
const db = require("../config/db.config");
const { post, user, like, story, storyLikes, storyViewers} = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");

exports.createStory = async (req, res) => {
  try {
    if (!req.body) {
      throw { text: "Content cannot be empty!" };
    }

    if (req?.decoded) {
      const decoded = req?.decoded;

      let img = "";
      if (req?.files["story"]) {
        img = await uploadFile(req, res);
        console.log("Image: ", img);
        if (img.length == 0) {
          throw { text: "Something went wrong uploading the image" };
        } else {
          img = img[0]?.name;
        }
      }

      let new_story = {
        user_id: decoded?.id,
        story: img,
      };

      const data = await story.create(new_story);

      if (data) {
        const return_data = data?.dataValues;
        if (return_data?.story?.length > 0) {
          return_data["story"] = process.env.UPLOAD_URL + "/story/" + return_data?.story;
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

exports.getStory = async (req, res) => {
    console.log('IM HERE');
    try {
      const storyData = await story.findAll({
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
        group: ['story.id']
      });
      console.log(storyData);
      res.status(responseCode.OK).send(responseObj.successObject("Success", storyData));
      return;
    } catch (err) {
      console.log("Error: ", err);
      res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.msg));
    }
  };

  exports.likeStory = async (req, res) => {
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
      const storyData = await story.findAll({ where: { id: req.body?.story_id, user_id: decoded?.id, is_delete: 0 } })
  
      if (storyData?.length > 0) {
        console.log("story data: ", storyData);
  
        let new_like = {
          story_id: req.body.story_id,
          user_id: req.body.user_id,
        };
  
        const data = await storyLikes.create(new_like)
        if (data) {
          const likesData = await storyLikes.findAll({
            subQuery: false,
            where: { story_id: req.body?.story_id, is_delete: 0 },
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
            group: ['storyLikes.id']
          });
          const likeCount = await storyLikes.count({where: {story_id: req.body?.story_id, is_delete: 0 }});
          console.log(likeCount);
          res.status(responseCode.OK).send(responseObj.successObject("story liked successfuly!", {"likesData": likesData ,"likeCount":likeCount}));
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

  exports.deleteStory = async (req, res) => {
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
      const storyData = await story.findAll({ where: { id: req.query?.id, user_id: decoded?.id, is_delete: 0 } })
  
      if (storyData?.length > 0) {
        console.log("story data: ", storyData);
  
        const data = await story.update({ is_delete: 1 }, { where: { id: req.query?.id, user_id: decoded?.id, is_delete: 0 } })
        if (data) {
          res.status(responseCode.OK).send(responseObj.successObject("story deleted successfuly!"))
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
        }
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("No such story"))
        return;
      }
    } catch (err) {
      console.log("Error: ", err);
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err))
    }
  }

  exports.createStoryViewers = async (req, res) => {
    try {
      if (!req.query) {
        throw { text: "Content cannot be empty!" };
      }
  
      if (req?.decoded) {
        const decoded = req?.decoded;
        
      const storyData = await story.findAll({ where: { id: req.query?.story_id, user_id: decoded?.id, is_delete: 0 } })
  
      if (storyData?.length > 0) {
        console.log("story data: ", storyData);

        let new_storyViewer = {
          story_id: req.query.story_id,
          viewer_user_id: req.query.viewer_user_id,
        };
  
        const data = await storyViewers.create(new_storyViewer);
  
        if (data) {
          const storyViewerData = await storyViewers.findAll({
            subQuery: false,
            where: { story_id: req.query?.story_id, is_delete: 0 },
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
            group: ['storyViewers.id']
          });
          res.status(responseCode.OK).send(responseObj.successObject("storyViewrs data available!", {"storyViewerData": storyViewerData}));
        }else {
          throw { text: "Something went wrong!" };
        }
      }
      }
    } catch (err) {
      console.log("error: ", err);
      res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.text ?? null, Object.keys(err).includes("text") ? null : err));
    }
  };
  
 