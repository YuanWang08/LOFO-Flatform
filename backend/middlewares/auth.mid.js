const request = require("request");
const { AuthorizationCode } = require("simple-oauth2");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const {
  models: { users: User },
} = require("../config/sequelize");

// Portal OAuth 設定
const config = {
  client: {
    id: process.env.PORTAL_CLIENT_ID,
    secret: process.env.PORTAL_CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://portal.ncu.edu.tw",
    tokenPath: "/oauth2/token",
    authorizePath: "/oauth2/authorization",
  },
};

const userInfoURL = "https://portal.ncu.edu.tw/apis/oauth/v1/info";

const client = new AuthorizationCode(config);

// Google OAuth 設定
const googleOAuth = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: `${process.env.BACKEND_BASE_URL}/auth/google/callback`,
  token_endpoint: "https://oauth2.googleapis.com/token",
  userinfo_endpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
};

// 原有 Portal OAuth 中間件
exports.oauth = async (req, res, next) => {
  const { code } = req.query;
  const options = {
    code,
  };

  if (code !== undefined) {
    try {
      const accessToken = await client.getToken(options);

      if (
        !accessToken ||
        !accessToken.token ||
        !accessToken.token.access_token
      ) {
        throw new Error("Failed to obtain access token");
      }

      request(
        {
          url: userInfoURL,
          headers: {
            Authorization: "Bearer " + accessToken.token.access_token,
            Accept: "application/json",
          },
        },
        async (e, result, body) => {
          try {
            if (!e && result.statusCode === 200) {
              req.authInfo = JSON.parse(body);
              return next();
            } else {
              throw new Error(
                `Failed to fetch user info: ${result.statusCode}`
              );
            }
          } catch (e) {
            console.error(e);
            return res.status(500).json({
              message: "OAuth failed",
            });
          }
        }
      );
    } catch (error) {
      console.error("Error", error.message);
      return res.redirect(`${process.env.FRONTEND_BASE_URL}`);
    }
  } else {
    return res.status(400).json({ message: "Missing authorization code" });
  }
};

exports.authRequired =
  (response = true) =>
  async (req, res, next) => {
    req.authorized = false;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      if (!response) {
        return next();
      }
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      req.id = decoded.sub;
      req.authorized = true;

      const user = await User.findByPk(req.id);
      if (!user) {
        if (!response) {
          return next();
        }
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      return next();
    } catch (err) {
      if (process.env.ENV === "dev") {
        console.log(err);
      }

      if (!response) {
        return next();
      }
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  };

exports.fakeAuth = async (req, res, next) => {
  req.authInfo = {
    identifier: "111999999",
  };
  return next();
};

// 新增 Google OAuth 中間件
exports.googleOauth = async (req, res, next) => {
  const { code } = req.query;

  if (code === undefined) {
    return res.status(400).json({ message: "Missing authorization code" });
  }

  try {
    // 透過 code 交換 token
    const tokenResponse = await axios.post(
      googleOAuth.token_endpoint,
      {
        code,
        client_id: googleOAuth.client_id,
        client_secret: googleOAuth.client_secret,
        redirect_uri: googleOAuth.redirect_uri,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      throw new Error("Failed to obtain access token from Google");
    }

    // 使用 token 獲取用戶資訊
    const userInfoResponse = await axios.get(googleOAuth.userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    if (!userInfoResponse.data || !userInfoResponse.data.email) {
      throw new Error("Failed to fetch user info from Google");
    }

    // 準備用戶資訊以供下一個中間件使用
    req.authInfo = {
      identifier: userInfoResponse.data.email,
      provider: "google",
      profile: {
        email: userInfoResponse.data.email,
        name: userInfoResponse.data.name,
        picture: userInfoResponse.data.picture,
      },
    };

    return next();
  } catch (error) {
    console.error("Google OAuth Error:", error.message);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/login?error=google_auth_failed`);
  }
};
