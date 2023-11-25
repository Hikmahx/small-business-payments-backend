const businessModel = require("../models/Business.model")
const { addSubscriberToNovu, triggerNotification } = require("../utils/novu")

const createBusiness = async (req, res) => {
    try {
        const { name, username, email, password, company_name, phone_number, address } = req.body
        const existingBusiness = await businessModel.findOne({
            email: email
        })
        if (existingBusiness) {
            return res.status(422).json({
                status: "error",
                message: "User Already exist"
            })
        }
        const business = await businessModel.create({
            name,
            username,
            email,
            password,
            company_name,
            phone_number,
            address
        })
        await addSubscriberToNovu(business._id, email)
        await triggerNotification(business._id, username, company_name)
        return res.status(201).json({
            status: "success",
            message: "Business created successfully",
            data: business
        })
    } catch (error) {
        return res.status(422).json({
            status: "error",
            data: error.message
        })
    }
}

const getBusiness = async (req, res) => {
    try {
        const business_id = req.user._id
        const business = await businessModel.findById({ _id: business_id })
        return res.status(200).json({
            status: "success",
            data: business
        })
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message
        })
    }
}

const updateBusinessInfo = async (req, res) => {
    try {
        const business_id = req.user._id
        const { phone_number, address, name, username } = req.body
        const businessUser = await businessModel.findById({ _id: business_id })
        if (!businessUser) {
            return res.status(404).json({
                status: "error",
                data: 'User not found'
            })
        }
        if (phone_number) {
            businessUser.phone_number = phone_number
        }
        if (address) {
            businessUser.address = address
        }
        if (name) {
            businessUser.name = name
        }
        if (username) {
            businessUser.username = username
        }
        await businessUser.save()
        return res.status(200).json({
            status: "success",
            message: "Business User Profile Updated Successfully",
            businessUser
        })
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message
        })
    }
}

const deleteBusiness = async (req, res) => {
    try {
        const business_id = req.user._id
        const business = await businessModel.findOne({ _id: business_id })
        if (!business) {
            return res.status(404).json({
                status: "error",
                message: "Business not found"
            })
        }
        await business.deleteOne()
        return res.status(200).json({
            status: "success",
            message: "Profile deleted successfully"
        })
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message
        })
    }
}

const getAllClientInformation = async (req, res) => {
    try {
        const business_client = req.user._id
        // fetches all client created by the business
        const found_business_client = await clientModel.find({ businessOwnerId: business_client })
        if (!business_client) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            })
        }
        if (!found_business_client || found_business_client.length === 0) {
            return res.status(404).json({
                status: "not found",
                message: "No clients found for the business owner."
            });
        }
        return res.status(200).json({
            status: "success",
            data: found_business_client
        })
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message
        })
    }
}

module.exports = {
    createBusiness,
    getBusiness,
    updateBusinessInfo,
    deleteBusiness,
    getAllClientInformation
}