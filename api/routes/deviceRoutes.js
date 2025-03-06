const express = require("express")
const router = express.Router()
const DeviceController = require("../controllers/DeviceController")
const {authenticateToken} = require("../middleware/AuthMiddleware")

router.use(authenticateToken)

router.get("/", DeviceController.getAllDevices)
router.post("/", DeviceController.addDevice)
router.delete("/:id", DeviceController.deleteDevice)

module.exports = router

