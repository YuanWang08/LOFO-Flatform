const {
  models: { users: User },
} = require("../config/sequelize");

const sequelize = require("../config/sequelize");

exports.findOrCreate = async (identifier) => {
  const user = await User.findOrCreate({
    where: { identifier },
  });
  return user;
};

exports.findUserById = async (userId) => {
  try {
    return await User.findByPk(userId);
  } catch (error) {
    console.error("Error finding user by id:", error.message);
    throw error;
  }
};

exports.updateUserInfo = async (userId, payload) => {
  try {
    let transaction;
    transaction = await sequelize.transaction();
    await User.update(
      payload,
      { where: { user_id: userId } },
      {
        transaction,
      }
    );
    await transaction.commit();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error updating user info:", error.message);
    throw error;
  }
};
