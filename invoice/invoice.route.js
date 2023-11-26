const express = require("express")
const controller = require("./invoice.controller")
const globalMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/create-invoice", globalMiddleware.BearerTokenBusiness, controller.CreateInvoice)
router.get("/outstanding", globalMiddleware.BearerTokenBusiness, controller.getOutstandingInvoices)
router.get("/overdue", globalMiddleware.BearerTokenBusiness, controller.getOverdueInvoicePayment)
router.get("/paid", globalMiddleware.BearerTokenBusiness, controller.getPaidInvoices)
router.get("/all-money", globalMiddleware.BearerTokenBusiness, controller.getAllInvoice)

module.exports = router