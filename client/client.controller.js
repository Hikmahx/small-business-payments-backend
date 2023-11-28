const clientModel = require("../models/Client.model")
const businessModel = require("../models/Business.model")
const invoiceModel = require("../models/Invoice.model")
const { addSubscriberToNovu, triggerClientRegistration } = require("../utils/novu")

const createClient = async (req, res) => {
    try {
        const business_id = req.user._id
        const { clientName, clientPhoneNumber, clientEmail, notes } = req.body
        const foundBusiness = await businessModel.findById({ _id: business_id })
        if (!foundBusiness) {
            return res.status(422).json({
                status: false,
                message: "Business does not exist, hence client cannot be created. Try again later..."
            })
        }
        const generateUniqueUsername = () => {
            const username = `${clientName.replace(/\s/g, '')}_${clientEmail.split('@')[0]}`;
            return username;
        };
        const generateUniquePassword = () => Math.random().toString(36).slice(-8);
        const username = generateUniqueUsername()
        const password = generateUniquePassword()
        const clientDetails = await clientModel.create({
            businessOwnerId: business_id._id,
            clientName,
            clientPhoneNumber,
            clientEmail,
            notes,
            username: username,
            password: password
        })
        await addSubscriberToNovu(clientDetails._id, clientEmail)
        await triggerClientRegistration(clientDetails._id, clientEmail, foundBusiness.company_name, foundBusiness.email, clientName, username, password)
        return res.status(201).json({
            status: true,
            message: "Client created successfully..",
            data: clientDetails
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const editClientInformation = async (req, res) => {
    try {
        const business_id = req.user._id
        const foundBusiness = await businessModel.findById({ _id: business_id })
        if (!foundBusiness) {
            return res.status(401).json({
                status: false,
                message: "Invalid business signature"
            })
        }
        const { clientName, clientPhoneNumber, notes } = req.body
        if (clientName) {
            foundBusiness.clientName = clientName
        }
        if (clientPhoneNumber) {
            foundBusiness.clientPhoneNumber = clientPhoneNumber
        }
        if (notes) {
            foundBusiness.notes = notes
        }
        await foundBusiness.save()
        return res, status(200).json({
            status: true,
            message: "Client profile updated successfully",
            data: foundBusiness
        })
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message
        })
    }
}

const getClientInformation = async (req, res) => {
    try {
        const clientId = req.client._id
        const clientInfo = await clientModel.findById({ _id: clientId })
        if (!clientInfo) {
            return res.status(400).json({
                status: false,
                message: "Client not found"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Profile found!",
            data: clientInfo
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const deleteClientInformation = async (req, res) => {
    try {
        const businessId = req.user._id;
        const clientIdToDelete = req.params.clientId;

        const clientToDelete = await clientModel.findOne({
            _id: clientIdToDelete,
            businessOwnerId: businessId,
        });

        if (!clientToDelete) {
            return res.status(404).json({ message: 'Client not found or unauthorized to delete.' });
        }
        const deletedClientInfo = await clientModel.findByIdAndDelete(clientIdToDelete);
        res.status(200).json({ message: 'Client deleted successfully', deletedClientInfo });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ status: false, error: 'Internal server error', message: error.message });
    }
};

const getAllPaidOutstandingOverdueInvoice = async (req, res) => {
    try {
        const client_id = req.client._id
        // all invoice
        const allInvoices = await invoiceModel.find({ clientId: client_id })
        let totalAmount = 0;
        allInvoices.forEach((invoice) => {
            totalAmount += invoice.amount;
        });
        // outstanding invoice
        const outstandingInvoices = await invoiceModel.find({ clientId: client_id, status: "outstanding" });
        let totalOutstandingdueAmount = 0;
        outstandingInvoices.forEach((invoice) => {
            totalOutstandingdueAmount += invoice.amount;
        });
        console.log({ totalOutstandingdueAmount });
        // overdue invoice
        const overdueInvoicePayment = await invoiceModel.find({ clientId: client_id, status: "overdue" })
        let totalOverdueAmount = 0;
        overdueInvoicePayment.forEach((invoice) => {
            totalOverdueAmount += invoice.amount;
        });
        // paid invoice
        const paidInvoices = await invoiceModel.find({ clientId: client_id, status: "paid" });
        let totalPaidAmount = 0;
        paidInvoices.forEach((invoice) => {
            totalPaidAmount += invoice.amount;
        });
        return res.status(200).json({
            status: true,
            allInvoice: totalAmount,
            outstanding: totalOutstandingdueAmount,
            overdue: totalOverdueAmount,
            paid: totalPaidAmount
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getAllInvoiceCustomer = async (req, res) => {
    try {
        const client_id = req.client._id
        const allInvoice = await invoiceModel.find({ clientId : client_id })
        return res.status(200).json({
            status : true,
            message : "Invoice gotten for user",
            data : allInvoice
        })
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}




module.exports = {
    createClient,
    editClientInformation,
    deleteClientInformation,
    getClientInformation,
    getAllPaidOutstandingOverdueInvoice,
    getAllInvoiceCustomer
}