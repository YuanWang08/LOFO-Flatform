const jwt = require("jsonwebtoken");
const UserCrud = require("../crud/user.crud");

const getToken = async (id) => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: id,
    expiresIn: "1d",
    issuer: process.env.BACKEND_HOST,
  });
};

exports.auth = async (req, res) => {
  const user = await UserCrud.findOrCreate(req.authInfo.identifier);
  if (!user) {
    return res.status(500).json({
      error: "creating user failed",
    });
  }

  if (req.query.notRedirect !== undefined) {
    return res.status(200).json({
      token: await getToken(user.id),
    });
  }

  // return res.status(200).json({
  //   token: await getToken(user[0]["user_id"]),
  // });
  return res.redirect(
    `${process.env.FRONTEND_BASE_URL}/token?token=${await getToken(
      user[0]["user_id"]
    )}`
  );
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await UserCrud.findUserById(req.id);

    delete user.dataValues.user_id;
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.id;
    const { ...userInfo } = req.body;

    await UserCrud.updateUserInfo(userId, userInfo);
    return res.status(200).json({
      message: "User info updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserInfo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.check = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User is authenticated",
    });
  } catch (error) {
    console.error("Error in check:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
