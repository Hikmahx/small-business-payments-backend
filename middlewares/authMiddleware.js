const validators = require("validatorjs")
const jwt = require("jsonwebtoken")
const businessModel = require("../models/Business.model")
const clientModel = require("../models/Client.model")


const ValidateCreation = async (req, res, next) => {
    try {
        const data = req.body
        let rules = {
            name: 'required|string',
            username: 'required|min:6|max:60',
            email: 'required|email',
            password: 'required|string|min:8',
            company_name: 'required|min:10|max:100',
            phone_number: 'required|string|min:10|max:11',
            address: {
                street: 'required|string',
                city: 'required|string',
                state: 'required|string',
                zip_code: 'required|string'
            }
          };
          let validation = new validators(data, rules)
          if (!validation.passes()) {
            return res.status(422).json({
                message: validation.errors.errors,
                success: false
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

const BearerTokenBusiness = async (req, res, next) => {
    try {
        const headers = req.headers
        if (!headers) {
            return res.status(400).json({
                status : "error",
                data : "You are not authorized"
            })
        }
        const token = headers.authorization.split(" ")[1]
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await businessModel.findOne({ _id : decoded._id })
        if (!user) {
            return res.status(400).json({
                status : "error",
                data : "You are not authorized"
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            data : "Unauthorized",
            message : error.message
        })
    }
}

const BearerTokenClient = async (req, res, next) => {
    try {
        const headers = req.headers
        if (!headers) {
            return res.status(400).json({
                status : "error",
                data : "You are not authorized"
            })
        }
        const token = headers.authorization.split(" ")[1]
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const client = await clientModel.findOne({ _id : decoded._id, clientEmail : decoded.email})
        console.log({client})
        if (!client) {
            return res.status(400).json({
                status : "error",
                data : "You are not authorized"
            })
        }
        req.client = client
        next()
    } catch (error) {
        return res.status(401).json({
            data : "Unauthorized",
            message : error.message
        })
    }
}

module.exports = {
    ValidateCreation,
    BearerTokenBusiness,
    BearerTokenClient
}