const mongoose = require("mongoose")
const schema = mongoose.Schema

const PaymentSchema = new schema({
    invoiceId : { type : schema.ObjectId, ref : "invoices", required : true},
    paymentAmount : { type : Number, required : true},
    paymentDate : { type : Date, default : new Date()},
    refrenceNumber : { type : String},
    status : {type : String, enum : ["pending", "accepted", "declined"], default : "pending"},
    created_at : { type : Date, default : new Date()}
})

const PaymentModel = mongoose.model("payments", PaymentSchema)
module.exports = PaymentModel