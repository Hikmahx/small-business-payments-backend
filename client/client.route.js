const express = require("express")
const globalMiddleware = require("../middlewares/authMiddleware")
const middleware = require("./client.middlewares")
const controller = require("./client.controller")
const router = express.Router()

// router.use(globalMiddleware.BearerToken)

router.post("/create-client", middleware.validateClientRegistration, middleware.duplicateEmail, globalMiddleware.BearerTokenBusiness, controller.createClient)
router.delete("/delete-client/:clientIdToDelete",controller.deleteClientInformation)
router.patch("/update-client", controller.editClientInformation)
router.get("/", globalMiddleware.BearerTokenClient, controller.getClientInformation)
router.get("/invoice-information", globalMiddleware.BearerTokenClient, controller.getAllPaidOutstandingOverdueInvoice)
router.get("/get-invoice-customer", globalMiddleware.BearerTokenClient, controller.getAllInvoiceCustomer)

module.exports = router