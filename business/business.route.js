const express = require("express")
const controller = require("./business.controller")
const middleware = require("../middlewares/authMiddleware")
const authMiddleware = require("./business.middleware")

const router = express.Router()

router.post("/sign-up", middleware.ValidateCreation, controller.createBusiness)
router.get("/", middleware.BearerTokenBusiness, controller.getBusiness)
router.patch("/update", middleware.BearerTokenBusiness, authMiddleware.validateUpdateInfo, controller.updateBusinessInfo)
router.delete("/delete", middleware.BearerTokenBusiness, controller.deleteBusiness)
router.get("/get-all-clients", middleware.BearerTokenBusiness, controller.getAllClientInformation)

module.exports = router