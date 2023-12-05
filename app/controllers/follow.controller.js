require("dotenv").config();
const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");
const userControl = require("./user.controller");
const db = require("../config/db.config");
const { post, user, like, follow } = db;

const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");

exports.followers = async (req, res) => {
  try {
    if (!req.body) {
      throw { text: "Content cannot be empty!" };
    }

    if (req?.decoded) {
      const decoded = req?.decoded;

      const followData = await follow.findAll({
        where: {
          follower_id: req.body.follower_id,
          following_id: decoded.id,
          is_delete: 0,
        },
      });

      if (followData?.length == 0) {
        console.log("follow data: ", followData);

        const userData = await user.findAll({
          where: { id: req.body.follower_id, is_delete: 0 },
        });

        if (userData.length > 0) {
          let new_follower = {
            follower_id: req.body.follower_id,
            following_id: decoded.id,
          };

          if (req.body.follower_id != decoded.id) {
            const data = await follow.create(new_follower);

            if (data) {
              const followerData = await follow.findAll({
                subQuery: false,
                where: {
                  follower_id: req.body.follower_id,
                  following_id: decoded.id,
                  is_delete: 0,
                },
                attributes: {
                  exclude: [
                    "is_delete",
                    "is_testdata",
                    "created_at",
                    "updated_at",
                  ],
                },
                include: [
                  {
                    model: user,
                    as: "follower",
                    where: { is_delete: 0 },
                    attributes: ["id", "user_name", "profile"],
                    required: false,
                  },
                ],
                group: ["follow.id"],
              });

              const followerCount = await follow.count({
                where: {
                  following_id: decoded.id,
                  is_delete: 0,
                },
              });
              console.log(followerCount);
              res
                .status(responseCode.OK)
                .send(
                  responseObj.successObject("Success", {
                    followerData: followerData,
                    followerCount: followerCount,
                  })
                );
            } else {
              throw { text: "Something went wrong!" };
            }
          } else {
            throw { text: "same content!" };
          }
        } else {
          throw { text: "user not present!" };
        }
      } else {
        throw { text: "Already present!" };
      }
    }
  } catch (err) {
    console.log("error: ", err);
    res
      .status(err?.status ?? responseCode.BADREQUEST)
      .send(
        responseObj.failObject(
          err?.text ?? null,
          Object.keys(err).includes("text") ? null : err
        )
      );
  }
};

exports.following = async (req, res) => {
  try {
    if (!req.body) {
      throw { text: "Content cannot be empty!" };
    }

    if (req?.decoded) {
      const decoded = req?.decoded;

      const followData = await follow.findAll({
        where: {
          following_id: req.body.following_id,
          follower_id: decoded.id,
          is_delete: 0,
        },
      });

      if (followData?.length == 0) {
        console.log("follow data: ", followData);

        const userData = await user.findAll({
          where: { id: req.body.following_id, is_delete: 0 },
        });

        if (userData.length > 0) {
          let new_following = {
            follower_id: decoded.id,
            following_id: req.body.following_id,
          };

          if (req.body.following_id != decoded.id) {
            const data = await follow.create(new_following);

            if (data) {
              const followingData = await follow.findAll({
                subQuery: false,
                where: {
                  follower_id: decoded.id,
                  following_id: req.body.following_id,
                  is_delete: 0,
                },
                attributes: {
                  exclude: [
                    "is_delete",
                    "is_testdata",
                    "created_at",
                    "updated_at",
                  ],
                },
                include: [
                  {
                    model: user,
                    as: "following",
                    where: { is_delete: 0 },
                    attributes: ["id", "user_name", "profile"],
                    required: false,
                  },
                ],
                group: ["follow.id"],
              });

              const followingCount = await follow.count({
                where: {
                  follower_id: decoded.id,
                  is_delete: 0,
                },
              });
              console.log(followingCount);
              res
                .status(responseCode.OK)
                .send(
                  responseObj.successObject("Success", {
                    followingCount: followingData,
                    followerCount: followingCount,
                  })
                );
            } else {
              throw { text: "Something went wrong!" };
            }
          } else {
            throw { text: "same content!" };
          }
        } else {
          throw { text: "user not present!" };
        }
      } else {
        throw { text: "Already present!" };
      }
    }
  } catch (err) {
    console.log("error: ", err);
    res
      .status(err?.status ?? responseCode.BADREQUEST)
      .send(
        responseObj.failObject(
          err?.text ?? null,
          Object.keys(err).includes("text") ? null : err
        )
      );
  }
};

exports.getFollowers = async (req, res) => {
  try {
    if (req?.decoded) {
      const decoded = req?.decoded;
      const followerData = await follow.findAll({
        subQuery: false,
        where: {
          following_id: decoded.id,
          is_delete: 0,
        },
        attributes: {
          exclude: ["is_delete", "is_testdata", "created_at", "updated_at"],
        },
        include: [
          {
            model: user,
            as: "follower",
            where: { is_delete: 0 },
            attributes: ["id", "user_name", "profile"],
            required: false,
          },
        ],
        group: ["follow.id"],
      });

      const followerCount = await follow.count({
        where: {
          following_id: decoded.id,
          is_delete: 0,
        },
      });
      console.log(followerCount);
      res
        .status(responseCode.OK)
        .send(
          responseObj.successObject("Success", {
            followerData: followerData,
            followerCount: followerCount,
          })
        );
    }
  } catch (err) {
    console.log("error: ", err);
    res
      .status(err?.status ?? responseCode.BADREQUEST)
      .send(
        responseObj.failObject(
          err?.text ?? null,
          Object.keys(err).includes("text") ? null : err
        )
      );
  }
};

exports.getFollowers = async (req, res) => {
  try {
    if (req?.decoded) {
      const decoded = req?.decoded;
      const followerData = await follow.findAll({
        subQuery: false,
        where: {
          following_id: decoded.id,
          is_delete: 0,
        },
        attributes: {
          exclude: ["is_delete", "is_testdata", "created_at", "updated_at"],
        },
        include: [
          {
            model: user,
            as: "follower",
            where: { is_delete: 0 },
            attributes: ["id", "user_name", "profile"],
            required: false,
          },
        ],
        group: ["follow.id"],
      });

      const followerCount = await follow.count({
        where: {
          following_id: decoded.id,
          is_delete: 0,
        },
      });
      console.log(followerCount);
      res
        .status(responseCode.OK)
        .send(
          responseObj.successObject("Success", {
            followerData: followerData,
            followerCount: followerCount,
          })
        );
    }
  } catch (err) {
    console.log("error: ", err);
    res
      .status(err?.status ?? responseCode.BADREQUEST)
      .send(
        responseObj.failObject(
          err?.text ?? null,
          Object.keys(err).includes("text") ? null : err
        )
      );
  }
};

exports.getFollowing = async (req, res) => {
  try {
    if (req?.decoded) {
      const decoded = req?.decoded;
      const followingData = await follow.findAll({
        subQuery: false,
        where: {
          follower_id: decoded.id,
          is_delete: 0,
        },
        attributes: {
          exclude: ["is_delete", "is_testdata", "created_at", "updated_at"],
        },
        include: [
          {
            model: user,
            as: "following",
            where: { is_delete: 0 },
            attributes: ["id", "user_name", "profile"],
            required: false,
          },
        ],
        group: ["follow.id"],
      });

      const followingCount = await follow.count({
        where: {
          follower_id: decoded.id,
          is_delete: 0,
        },
      });
      console.log(followingCount);
      res
        .status(responseCode.OK)
        .send(
          responseObj.successObject("Success", {
            followerData: followingData,
            followingCount: followingCount,
          })
        );
    }
  } catch (err) {
    console.log("error: ", err);
    res
      .status(err?.status ?? responseCode.BADREQUEST)
      .send(
        responseObj.failObject(
          err?.text ?? null,
          Object.keys(err).includes("text") ? null : err
        )
      );
  }
};

exports.unfollow = async (req, res) => {
  try {
    if (!req.body) {
      throw { text: "Content cannot be empty!" };
    }

    if (req?.decoded) {
      const decoded = req?.decoded;

      const unfollowData = await follow.findAll({
        where: {
          following_id: req.body.following_id,
          follower_id: decoded.id,
          is_delete: 0,
        },
      });

      if (unfollowData?.length > 0) {
        console.log("unfollow data: ", decoded.id);
        console.log("unfollow data: ", unfollowData);

        const userData = await user.findAll({
          where: { id: req.body.following_id, is_delete: 0 },
        });

        if (userData.length > 0) {
          let new_following = {
            follower_id: decoded.id,
            following_id: req.body.following_id,
          };

          if (req.body.following_id != decoded.id) {
            const data = await follow.update({ is_delete: 1 },{ where: { follower_id: decoded.id, following_id: req.body.following_id } });
            if (data) {
              res
                .status(responseCode.OK)
                .send(
                  responseObj.successObject("Successfully unfollowed")
                );
            } else {
              throw { text: "Something went wrong!" };
            }
          } else {
            throw { text: "same content!" };
          }
        } else {
          throw { text: "user not present!" };
        }
      } else {
        throw { text: "Already present!" };
      }
    }
  } catch (err) {
    console.log("error: ", err);
    res
      .status(err?.status ?? responseCode.BADREQUEST)
      .send(
        responseObj.failObject(
          err?.text ?? null,
          Object.keys(err).includes("text") ? null : err
        )
      );
  }
};
