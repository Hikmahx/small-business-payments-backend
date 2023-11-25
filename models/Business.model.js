const mongoose = require("mongoose")
const schema = mongoose.Schema
const bcrypt = require("bcrypt")

const BusinessOwnerSchema = new schema({
    name : { type : String, required : true},
    username : { type : String, required : true, unique : true},
    email : { type : String, unique : true, required : true},
    password : { type : String, required : true},
    company_name : { type : String},
    phone_number : { type : String},
    address : {
        street : { type : String, required  : true},
        city : { type : String, required : true},
        state : { type : String, required : true},
        zip_code : { type : String}
    },
    googleId :{type : String, default: null},
    created_at : { type : Date, default : new Date()}
})
// hashing password
BusinessOwnerSchema.pre("save", async function (next) {
    if (this.password) {
        const user = this
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
    next()
})

// comparing password for login
BusinessOwnerSchema.methods.IsValidPassword = async function (password) {
    if (!this.password) {
        return false
    }
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    return compare
}

const BusinessOwnerModel = mongoose.model("business", BusinessOwnerSchema)
module.exports = BusinessOwnerModel