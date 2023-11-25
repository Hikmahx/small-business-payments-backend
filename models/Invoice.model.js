const mongoose = require("mongoose")
const schema = mongoose.Schema

const InvoiceSchema = new schema({
    clientId: {
        type: schema.ObjectId,
        ref: "ClientSchema",
        required: true
    },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    isPaid: { type: Boolean, default: false },
    paymentHistory: [
        {
            paymentDate: { type: Date },
            paymentAmount: { type: Number },
        }
    ],
    remarks : { type : String},
    created_at : {type : Date, default : new Date()}
})

const InvoiceModel = mongoose.model("invoices", InvoiceSchema)
module.exports = InvoiceModel