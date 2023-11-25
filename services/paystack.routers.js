const express = require("express")
const globalMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()
const service = require("../utils/paystack")

router.get("/initialize/:invoiceId", globalMiddleware.BearerTokenClient, service.initializePayment)
router.get("/verify-transaction/:reference", service.verifyTransaction)
router.get('/payment/callback/paystack',async (req, res) => {
    console.log(req);
    res.send(200);
})


module.exports = router
