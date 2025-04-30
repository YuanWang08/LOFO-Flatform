const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const userCtrl = require("../controllers/userController");

router.get("/go", async (req, res) => {
  res.redirect(
    `https://portal.ncu.edu.tw/oauth2/authorization?response_type=code&client_id=${process.env.PORTAL_CLIENT_ID}&redirect_uri=${process.env.BACKEND_BASE_URL}/auth/callback&scope=identifier`
  );
});

router.get("/callback", authMid.oauth, userCtrl.auth);

router.get("/fakeAuth", authMid.fakeAuth, userCtrl.auth);

module.exports = router;
