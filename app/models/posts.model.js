module.exports = (sequelize, Sequelize) => {
  const Posts = sequelize.define(
    "posts",
    {
      user_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      media: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: Sequelize.STRING,
      },
      tag: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
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

  return Posts;
};
