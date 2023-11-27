const mongoose = require("mongoose")
const schema = mongoose.Schema

const InvoiceSchema = new schema({
    clientId: {
        type: schema.ObjectId,
        ref: "ClientSchema",
        required: true
    },
    businessId: {
        type: schema.ObjectId,
        ref: "BusinessOwnerSchema"
    },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String,  enum : ["outstanding", "overdue", "paid"], default: "outstanding" },
    paymentHistory: [
        {
            paymentDate: { type: Date },
            paymentAmount: { type: Number },
        }
    ],
    referenceNumber : { type : String},
    remarks : { type : String},
    created_at : {type : Date, default : new Date()}
})

const InvoiceModel = mongoose.model("invoices", InvoiceSchema)
module.exports = InvoiceModel