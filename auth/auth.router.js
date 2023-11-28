const express = require("express")
const controller = require("./auth.controller")
const middlewares = require("./auth.middleware")
const passport = require("passport")
const router = express.Router()

router.post("/login-business", middlewares.validateLogin, controller.LoginForBusiness)
router.post("/login-client", middlewares.validateLogin, controller.LoginForClient)
router.post("/forgot-password", controller.ForgotPassword)
router.post("/reset-password", controller.ResetPassword)
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/');
  }
);


module.exports = router