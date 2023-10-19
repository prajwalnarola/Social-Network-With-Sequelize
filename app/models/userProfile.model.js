module.exports = (sequelize, Sequelize) => {
  const UserProfile = sequelize.define(
    "userProfile",
    {
      user_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      full_name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        },
      },
      profile: {
        type: Sequelize.STRING,
      },
      DOB: {
        type: Sequelize.DATE,
        validate: {
          notEmpty: true,
        },
      },
      user_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = inactive, 1 = active",
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
        comment: "0 = false, 1 = true",
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

  return UserProfile;
};
