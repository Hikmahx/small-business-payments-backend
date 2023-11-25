const express = require("express")
const controller = require("./auth.controller")
const middlewares = require("./auth.middleware")
const router = express.Router()

router.post("/login-business", middlewares.validateLogin, controller.LoginForBusiness)
router.post("/login-client", middlewares.validateLogin, controller.LoginForClient)
router.post("/forgot-password", controller.ForgotPassword)
router.post("/reset-password", controller.ResetPassword)


module.exports = router