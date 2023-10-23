module.exports = (sequelize, Sequelize) => {
  const StoryViewers = sequelize.define(
    "storyViewers",
    {
      story_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      viewer_user_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = false, 1 = true",
      },
      is_testdata: {
        type: Sequelize.BOOLEAN,
        defaultValue: "1",
        comment: "0 = false, 1 = true",
      },
    },
    { freezeTableName: true, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" },
  );

  return StoryViewers;
};
