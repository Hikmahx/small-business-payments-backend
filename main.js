const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const businessRouter = require("./business/business.route")
const authRouter = require("./auth/auth.router")
const clientRouter = require("./client/client.route")
const invoiceRouter = require("./invoice/invoice.route")
const serviceRouter = require("./services/paystack.routers")
const schedule = require("node-schedule")
const passport = require("passport")
const invoiceModel = require("./models/Invoice.model")
const session = require('express-session');
const { triggerOverDueInvoiceNotification } = require("./utils/novu");
const ClientModel = require("./models/Client.model");
const BusinessOwnerModel = require("./models/Business.model");
connectDB.connect()
require("dotenv").config()

const app = express();
app.use(express.json());
app.use(session({
  secret : process.env.COOKIEKEY,
  saveUninitialized: false,
  resave : false
}))

app.use(passport.initialize())
app.use(passport.session())

// CORS
app.use(cors());
// ROUTES
app.use("/api/v1/business", businessRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/client", clientRouter)
app.use("/api/v1/invoice", invoiceRouter)
app.use("/api/v1/service", serviceRouter)

app.get("/", (req, res) => {
  console.log("Hello world");
  return res
    .status(200)
    .json({
      message:
        "Hi there! This is a backend project for small business payment management. Check GitHub: https://github.com/Hikmahx/small-business-payments-backend for more info",
    });
});

schedule.scheduleJob("0 0 * * *", async () => {
  console.log('Cron job running in the background.');

  const overdueInvoices = await invoiceModel.find({
    dueDate: { $lte: new Date() },
    status: { $ne: 'overdue' }
  });

  // Update the status of overdue invoices sequentially
  for (const invoice of overdueInvoices) {
    try {
      invoice.status = 'overdue';
      await invoice.save();
      console.log("Invoice saved");

      const client = await ClientModel.findById(invoice.clientId);
      const businessDetails = await BusinessOwnerModel.findOne({ _id: client.businessOwnerId })

      await triggerOverDueInvoiceNotification(
        client._id,
        client.clientName,
        invoice._id,
        invoice.dueDate,
        businessDetails.email,
        businessDetails.company_name
      );

      console.log("Mail sent");
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  }

  console.log('Invoice cron job executed.');
});



module.exports = app