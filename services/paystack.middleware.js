const invoiceModel = require("../models/Invoice.model")

// export default function preventDoublePayment (req, res, next) {
//     try {
//         const reference = req.params.reference
//         paymentModel.findOne({ refrenceNumber : reference}, (err, existingPayment) => {
//             if (err) return res.status(500).json({
//                 status : false,
//                 message : "An error occured while checking for existing payment"
//             })

//             if (existingPayment && existingPayment.status === "accepted") return res.status(422).json({
//                 status : false,
//                 message : "Payment already processed for this invoice"
//             })
//             next()
//         })
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: "An error occurred",
//             data: error
//         });
//     }
// }

const preventDoublePayment = async (req, res, next) => {
    try {
        const invoiceId = req.params.invoiceId
        const existingPayment = await invoiceModel.findOne({ _id: invoiceId })
        if (existingPayment && existingPayment.status === "paid") return res.status(422).json({
            status: false,
            message: "Invoice already paid and processed for this invoice"
        })
        next()
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred",
            data: error
        });
    }
}


module.exports = {
    preventDoublePayment
}