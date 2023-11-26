const https = require("https")
const invoiceModel = require("../models/Invoice.model")
const clientModel = require("../models/Client.model")
const PaymentModel = require("../models/payment.model")

const initializePayment = async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId
        const client = req.client._id
        const invoice = await invoiceModel.findOne({ _id: invoiceId, clientId: client });
        const clientSide = await clientModel.find({ _id: client })
        if (!invoice) {
            return res.status(404).json({
                status: "error",
                message: "Invoice not found or unauthorized"
            });
        }

        const clientEmail = clientSide.length > 0 ? clientSide[0].clientEmail : null;
        const amount = invoice.amount;

        const params = JSON.stringify({
            email: clientEmail,
            amount: 100 * amount,
        });
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.TEST_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
        const request = https.request(options, response => {
            let data = ""

            response.on("data", (chunk) => {
                data += chunk
            })
            response.on("end", async () => {
                console.log(data);
                const responseData = JSON.parse(data)
                if (responseData && responseData.data && responseData.data.reference) {
                    const reference = responseData.data.reference;
                    await invoiceModel.findOneAndUpdate(
                        { _id: invoiceId },
                        { $set: { referenceNumber: reference } }
                    );

                    await PaymentModel.create({
                        invoiceId: invoiceId,
                        paymentAmount: amount,
                        paymentDate: new Date(),
                        refrenceNumber: reference,
                        status: "pending"
                    });

                    return res.status(200).json(responseData);
                } else {
                    console.log("Reference not found in the response");
                    return res.status(500).json("An error occurred");
                }
            })
                .on("error", () => {
                    console.log(error);
                })
        })
        request.write(params)
        request.end()
    } catch (error) {
        console.log(error);
        res.status(500).json("An error occurred");
    }
}

const verifyTransaction = async (req, res) => {
    try {
        const reference = req.params.reference;
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.TEST_SECRET_KEY}`
            }
        }

        const request = https.request(options, response => {
            let data = ''

            response.on('data', (chunk) => {
                data += chunk
            });

            response.on('end', async () => {
                const responseData = JSON.parse(data);
                const ref = responseData.data.reference
                const paymentStatus = responseData.data.status;
                console.log({ paymentStatus });
                if (paymentStatus === "success") {
                    const invoiceamt = await invoiceModel.findOne({ referenceNumber : ref})
                    const amount = invoiceamt.amount
                    // Update paymentStatus in PaymentModel
                    await PaymentModel.findOneAndUpdate(
                        { refrenceNumber: ref },
                        { $set: { status: "accepted" } }
                    );
                    await invoiceModel.findOneAndUpdate(
                        { referenceNumber: ref },
                        {
                            $push: {
                                paymentHistory: {
                                    paymentDate: new Date(),
                                    paymentAmount: amount
                                }
                            },
                            $set: { status: "paid" }
                        },
                    );
                    return res.status(200).json(responseData);
                } else if (paymentStatus === "pending") {
                    // Update paymentStatus in PaymentModel
                    await PaymentModel.findOneAndUpdate(
                        { refrenceNumber: ref },
                        { $set: { status: "pending" } }
                    );
                    return res.status(200).json(responseData);
                } else if (paymentStatus === "declined" || paymentStatus === "abandoned") {
                    // Update paymentStatus in PaymentModel
                    await PaymentModel.findOneAndUpdate(
                        { refrenceNumber: ref },
                        { $set: { status: "declined" } }
                    );
                    return res.status(200).json(responseData);
                } else {
                    console.log("Unhandled payment status:", paymentStatus);
                    return res.status(500).json("An error occurred");
                }
            })
        }).on('error', error => {
            console.error(error)
        })
        request.end()
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            data: error
        });
    }
}

module.exports = {
    initializePayment,
    verifyTransaction
}