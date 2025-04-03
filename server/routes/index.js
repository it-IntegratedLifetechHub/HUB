const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const { register, login } = require("../Controllers/AuthController");
const ensureAuthenticated = require("../Middlewares/Auth");

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);

router.get("/protected", ensureAuthenticated, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
