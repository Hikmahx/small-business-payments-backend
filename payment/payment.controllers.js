const paymentModel = require("../models/payment.model")

const updatePaymentStatus = async (ref, paymentStatus) => {
    try {
        const payment = await paymentModel.findOne({ refrenceNumber : ref });
        console.log({payment});

        if (!payment) {
            console.log("Payment record not found");
            return;
        }

        // Update payment status based on Paystack respons
        console.log("Payment status updated successfully");
    } catch (error) {
        console.error("Error updating payment status:", error);
    }
};

module.exports = {
    updatePaymentStatus
}