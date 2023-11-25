const mongoose = require("mongoose")
const schema = mongoose.Schema
const bcrypt = require("bcrypt")

const ClientSchema = new schema({
    businessOwnerId : { type : schema.ObjectId, ref : "BusinessOwner", required : true },
    clientName : { type : String, required : true },
    clientPhoneNumber : { type : String, required : true},
    clientEmail : {type : String, required : true, unique : true},
    notes : { type : String },
    username : {type : String},
    password : {type : String}
})

ClientSchema.pre("save", async function (next) {
    if (this.password) {
        const user = this
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
    next()
})

// comparing password for login
ClientSchema.methods.IsValidPassword = async function (password) {
    if (!this.password) {
        return false
    }
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    return compare
}

const ClientModel = mongoose.model("clients", ClientSchema)
module.exports = ClientModel