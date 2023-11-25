const validators = require("validatorjs")

const validateLogin = async (req, res, next) => {
    try {
        const data = req.body
        let rules = {
            username: 'required|min:6|max:60',
            password: 'required|string|min:8'
          };
          let validation = new validators(data, rules)
          if (!validation.passes()) {
            return res.status(422).json({
                message: validation.errors.errors,
                success: false
            })
          }
          next()
    } catch (error) {
        return res.status(500).json({
            status : "error",
            message : error.message
        })
    }
}

module.exports = {
    validateLogin
}