const invoiceModel = require("../models/Invoice.model")
const clientModel = require("../models/Client.model")
const businessModel = require("../models/Business.model")
const { triggerInvoiceIntegration } = require("../utils/novu")

const CreateInvoice = async (req, res) => {
  try {
    const business = req.user._id
    const { clientId, amount, dueDate } = req.body
    const client = await clientModel.findById({ _id: clientId })
    const businessUser = await businessModel.findById({ _id: business })
    if (!client) {
      return res.status(404).json({
        status: false,
        message: "Client not found"
      })
    }
    // create the invoice
    const invoice = await invoiceModel.create({
      clientId,
      amount,
      dueDate,
      created_at: new Date()
    })
    await triggerInvoiceIntegration(client._id, client.clientEmail, client.clientName, businessUser.company_name, amount, dueDate, businessUser.email)
    return res.status(201).json({
      status: true,
      message: "Invoice created successfully",
      data: invoice
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}

const getOutstandingInvoices = async (req, res) => {
  try {
    const client_id = req.user._id
    const unpaidInvoices = await invoiceModel.find({ clientId: client_id, status: "outstanding" });
    let totalOverdueAmount = 0;
    unpaidInvoices.forEach((invoice) => {
      totalOverdueAmount += invoice.amount;
    });
    return res.status(200).json({
      status: true,
      message: "Outstanding Invoices gotten",
      data: unpaidInvoices,
      outstanding: totalOverdueAmount
    });
  } catch (error) {
    console.error('Error fetching unpaid invoices:', error);
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const getOverdueInvoicePayment = async (req, res) => {
  try {
    const client_id = req.user._id
    const overdueInvoicePayment = await invoiceModel.find({ clientId: client_id, status: "overdue" })
    let totalOverdueAmount = 0;
    overdueInvoicePayment.forEach((invoice) => {
      totalOverdueAmount += invoice.amount;
    });
    return res.status(200).json({
      status: true,
      message: "Overdue Invoices gotten",
      data: overdueInvoicePayment,
      overdue: totalOverdueAmount
    });
  } catch (error) {
    console.error('Error fetching unpaid invoices:', error);
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
}

const getPaidInvoices = async (req, res) => {
  try {
    const client_id = req.user._id
    const paidInvoices = await invoiceModel.find({ clientId: client_id, status: "paid" });
    let totalOverdueAmount = 0;
    paidInvoices.forEach((invoice) => {
      totalOverdueAmount += invoice.amount;
    });
    return res.status(200).json({
      status: true,
      message: "Outstanding Invoices gotten",
      data: paidInvoices,
      outstanding: totalOverdueAmount
    });
  } catch (error) {
    console.error('Error fetching unpaid invoices:', error);
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const getAllInvoice = async (req, res) => {
  try {
    const business_id = req.user._id
    const allInvoices = await invoiceModel.find({
      clientId: { $elemMatch: { businessId: business_id } }
    });
    console.log({ allInvoices })
    let totalOverdueAmount = 0;
    allInvoices.forEach((invoice) => {
      totalOverdueAmount += invoice.amount;
    });
    return res.status(200).json({
      status: true,
      message: "All invoice fund gotten",
      amount: totalOverdueAmount
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
}



module.exports = {
  CreateInvoice,
  getOutstandingInvoices,
  getOverdueInvoicePayment,
  getPaidInvoices,
  getAllInvoice
}