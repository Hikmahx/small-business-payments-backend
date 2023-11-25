const express = require("express")
const controller = require("./invoice.controller")
const globalMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/create-invoice", globalMiddleware.BearerTokenBusiness, controller.CreateInvoice)
router.get("/get-unpaid-invoice", globalMiddleware.BearerTokenClient, controller.getUnpaidInvoices)

module.exports = router