const express = require("express")
const route = express.Router()
const controller =  require("../controllers")
const auth = require("../middleware/auth")

route.post("/signup",controller.createUser)
route.post("/login",controller.loginUser)
route.get("/userList",auth, controller.userList)
route.patch("/updateUser/:id",auth, controller.updateUser)
route.get("/search/:key",auth, controller.searchData)

module.exports = route