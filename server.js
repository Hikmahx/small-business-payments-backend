const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const businessRouter = require("./business/business.route")
const authRouter = require("./auth/auth.router")
const clientRouter = require("./client/client.route")
const invoiceRouter = require("./invoice/invoice.route")
const serviceRouter = require("./services/paystack.routers")
require("dotenv").config()
connectDB();

const app = express();
const PORT = process.env.PORT;
app.use(express.json({ extended: false }));

// CORS
app.use(cors());
// ROUTES
app.use("/api/v1/business", businessRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/client", clientRouter)
app.use("/api/v1/invoice", invoiceRouter)
app.use("/api/v1/service", serviceRouter)

// ROUTES
// app.use("/api/business", require("./routes/business.route"));
// app.use("/api/client", require("./routes/client.route"));
// app.use("/api/invoice", require("./routes/invoice.route"));

app.get("/", (req, res) => {
  console.log("Hello world");
  return res
    .status(200)
    .json({
      message:
        "Hi there! This is a backend project for small business payment management. Check GitHub: https://github.com/Hikmahx/small-business-payments-backend for more info",
    });
});

app.listen(PORT, () => console.log("This is listening on PORT: " + PORT));
