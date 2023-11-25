const invoiceModel = require("../models/Invoice.model")
const clientModel = require("../models/Client.model")
const businessModel = require("../models/Business.model")
const { triggerInvoiceIntegration } = require("../utils/novu")

const CreateInvoice = async (req, res) => {
    try {
        const business = req.user._id
        const { clientId, amount, dueDate } = req.body
        const client = await clientModel.findById({_id : clientId})
        const businessUser = await businessModel.findById({_id : business})
        if (!client) {
            return res.status(404).json({
                status : false,
                message : "Client not found"
            })
        }
        // create the invoice
        const invoice = await invoiceModel.create({
            clientId,
            amount,
            dueDate,
            created_at : new Date()
        })
        await triggerInvoiceIntegration(client._id, client.clientEmail, client.clientName, businessUser.company_name, amount, dueDate, businessUser.email)
        return res.status(201).json({
            status : true, 
            message : "Invoice created successfully",
            data : invoice
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getUnpaidInvoices = async (req, res) => {
    try {
        const client_id = req.client._id
      const unpaidInvoices = await invoiceModel.find({ clientId: client_id, isPaid: false });
      res.status(200).json({
        status : true,
        message : "Unpaid Invoices gotten",
        data : unpaidInvoices
      });
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
      res.status(500).json({
        status : false,
        message : error.message
      });
    }
  };

module.exports = {
    CreateInvoice,
    getUnpaidInvoices
}