const validators = require("validatorjs")
const ClientModel = require("../models/Client.model")

const validateClientRegistration = async (req, res, next) => {
    try {
        const data = req.body
        const rules = {
            clientName : "required|string",
            clientPhoneNumber : 'required|string|min:10|max:11',
            clientEmail : 'required|email',
            notes : 'string'
        }
        let validation = new validators(data, rules)
        if (!validation.passes()) {
            return res.status(422).json({
                message : validation.errors.errors,
                status : false
            })
        }
        next()
    } catch (error) {
        return res.status(422).json({
            success: false,
            message: error.message
        })
    }
}

const duplicateEmail = async (req, res, next) => {
    try {
        const { clientEmail } = req.body
        const existingClient = await ClientModel.findOne({clientEmail : clientEmail})
        if (existingClient) {
            return res.status(422).json({
                status : "error",
                data : "An error occured because this Email is either taken or already exist"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            status : "error",
            data : error.message
        })
    }
}

module.exports = {
    validateClientRegistration,
    duplicateEmail
}