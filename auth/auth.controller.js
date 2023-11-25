const businessModel = require("../models/Business.model")
const clientModel = require("../models/Client.model")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { triggerPasswordReset } = require("../utils/novu")
require("dotenv").config()

const LoginForBusiness = async (req, res) => {
    try {
        const { username, password } = req.body
        const business = await businessModel.findOne({
            username : username
        })
        if (!business) {
            return res.status(404).json({
                status : "error",
                data : "Business information not found"
            })
        }
        const validPassword = await business.IsValidPassword(password)
        if (!validPassword) {
            return res.status(400).json({
                status : "error",
                data : "Username or Password is incorrect"
            })
        }
        const token = jwt.sign({email : business.email, _id : business._id}, process.env.JWT_SECRET, {expiresIn : "1hr"})
        return res.status(200).json({
            status : "success",
            business,
            token
        })
    } catch (error) {
        console.error(error)
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const LoginForClient = async (req, res) => {
    try {
        const { username, password } = req.body
        const client = await clientModel.findOne({
            username : username
        })
        if (!client) {
            return res.status(404).json({
                status : "error",
                data : "Client information not found"
            })
        }
        const validPassword = await client.IsValidPassword(password)
        if (!validPassword) {
            return res.status(400).json({
                status : "error",
                data : "Username or Password is incorrect"
            })
        }
        const token = jwt.sign({email : client.clientEmail, _id : client._id}, process.env.JWT_SECRET, {expiresIn : "1hr"})
        return res.status(200).json({
            status : "success",
            client,
            token
        })
    } catch (error) {
        console.error(error)
        return res.status(422).json({
            status : "error",
            data : error.message
        })
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const business = await businessModel.findOne({email:email})
        if (!business) {
            return res.status(404).json({
                status : "error",
                message : "User not found"
            })
        }
        const token = crypto.randomBytes(20).toString('hex');
        const resetLink = `http://localhost:8081/reset-password/${business._id}/${token}`
        await triggerPasswordReset(business._id, business.email, resetLink)
        return res.status(200).json({
            status : "success",
            message : "mail sent successfully"
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { newpassword, confirmpassword } = req.body
        const business = await businessModel.findOne({_id : id})
        if (!business) {
            return res.status(404).json({
                status : "error",
                message : "Business user not found"
            })
        }
        if( newpassword != confirmpassword ) {
            return res.status(406).json({
                status : "error",
                message : "Password do not match."
            })
        }
        user.password = newpassword
        await user.save()
        return res.status(200).json({
            status : "success",
            message : "Password updated successfully. Kindly login with your newly created password."
        })
    } catch (error) {
        return res.status(422).json({
            status : "error",
            message : error.message
        })
    }
}

module.exports = {
    LoginForBusiness,
    ForgotPassword,
    ResetPassword,
    LoginForClient
}