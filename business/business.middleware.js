const validators = require("validatorjs")

const validateUpdateInfo = async (req, res, next) => {
    try {
        const data = req.body
        let rules = {
            phone_number: 'required|string|min:10|max:11',
            address: {
                street: 'required|string',
                city: 'required|string',
                state: 'required|string',
                zip_code: 'required|string'
            },
            name: 'required|string',
            username: 'required|min:6|max:60',
        }
        let validation = new validators(data, rules)
        if (!validation.passes()) {
            return res.status(422).json({
                message: validation.errors.errors,
                status: false
            })
        }
        next()
    } catch (error) {
        return res.status(422).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    validateUpdateInfo
}