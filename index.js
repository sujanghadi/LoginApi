const express = require("express")
const app = express()
require("dotenv").config()
require("./server/database")()
app.use(express.json({
    type: ['application/json', 'text/plain']
  }))
app.use("/",require("./server/routes"))


const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})