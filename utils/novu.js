const Novu = require("@novu/node")
require("dotenv").config()

const novu = new Novu.Novu(process.env.NOVU_API_KEY);

async function addSubscriberToNovu(subscriberId, email) {
    await novu.subscribers.identify(subscriberId, {
        email: email
    });
    console.log("Added subscriber successfully!")
}

async function triggerNotification(subscriberId, username, company_name) {
    novu.trigger(process.env.NOTIFICATION_WORKFLOW, {
        to : {
            subscriberId : subscriberId
        },
        payload : {
            username : username,
            company_name : company_name
        }
    })
    console.log("Email sent successfully!");
}

async function triggerPasswordReset(subscriberId, email, resetLink) {
    novu.trigger(process.env.PASSWORD_RESET_WORKFLOW, {
        to : {
            subscriberId : subscriberId
        },
        payload : {
            email : email,
            resetLink : resetLink
        }
    })
    console.log("Passowrd reset gone successfully");
}

async function triggerClientRegistration(subscriberId, email, business_company_name, business_company_email,  clientName, username, password) {
    novu.trigger(process.env.CLIENT_REGISTRATION_WORKFLOW, {
        to : {
            subscriberId : subscriberId
        },
        payload : {
            email : email,
            business_company_name : business_company_name,
            business_company_email : business_company_email,
            clientName : clientName,
            username : username,
            password : password
        }
    })
    console.log("Sent to client email address");
}

async function triggerInvoiceIntegration(subscriberId, email, client_name, business_company_name, invoice_amount, due_date, business_company_email) {
    novu.trigger(process.env.INVOICE_MAIL, {
        to : {
            subscriberId : subscriberId
        },
        payload : {
            email: email,
            client_name : client_name,
            business_company_name : business_company_name,
            invoice_amount : invoice_amount,
            due_date : due_date,
            business_company_email : business_company_email
        }
    })
    console.log("Invoice sent to client email address");
}
// console.log("novu_api_key: ", process.env.NOTIFICATION_WORKFLOW)
// console.log("novu_api_key: ", process.env.CLIENT_REGISTRATION_WORKFLOW)


module.exports = {
    addSubscriberToNovu,
    triggerNotification,
    triggerPasswordReset,
    triggerClientRegistration,
    triggerInvoiceIntegration
}