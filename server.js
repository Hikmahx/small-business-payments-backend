const app = require("./main")
const config = require("./config/db")
require("dotenv").config()


const port = process.env.PORT



config.connect()

app.listen(port, () => console.log(`listening on port: ${port}`))