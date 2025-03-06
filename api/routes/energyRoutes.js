const express = require("express")
const router = express.Router()
const EnergyController = require("../controllers/EnergyController")
const { authenticateToken } = require("../middleware/AuthMiddleware")

router.use(authenticateToken)

router.get("/usage", EnergyController.getEnergyUsage)

module.exports = router

