const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mysql = require("mysql2/promise")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ])
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.status(201).json({ token })
  } catch (error) {
    res.status(500).json({ error: "Error registering user" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    if (users.length === 0) return res.status(400).json({ error: "User not found" })
    const user = users[0]
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
      res.json({ token })
    } else {
      res.status(400).json({ error: "Invalid password" })
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in" })
  }
})



//user routes
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query("SELECT name FROM users WHERE id = ?", [req.user.id])
    if (users.length > 0) {
      res.json({ name: users[0].name })
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data" })
  }
})

// Device routes
app.get("/api/devices", authenticateToken, async (req, res) => {
  try {
    const [devices] = await pool.query("SELECT * FROM devices WHERE user_id = ?", [req.user.id])
    res.json(devices)
  } catch (error) {
    res.status(500).json({ error: "Error fetching devices" })
  }
})

app.post("/api/devices", authenticateToken, async (req, res) => {
  try {
    const { name, type } = req.body
    const [result] = await pool.query("INSERT INTO devices (user_id, name, type) VALUES (?, ?, ?)", [
      req.user.id,
      name,
      type,
    ])
    res.status(201).json({ id: result.insertId, name, type })
  } catch (error) {
    res.status(500).json({ error: "Error adding device" })
  }
})

app.delete("/api/devices/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM devices WHERE id = ? AND user_id = ?", [req.params.id, req.user.id])
    res.json({ message: "Device deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Error deleting device" })
  }
})

// Energy usage routes
app.get("/api/energy/usage", authenticateToken, async (req, res) => {
  try {
    const [usage] = await pool.query(
      `
      SELECT DATE(timestamp) as date, SUM(energy_usage) as total_usage
      FROM energy_data
      JOIN devices ON energy_data.device_id = devices.id
      WHERE devices.user_id = ?
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp) DESC
      LIMIT 30
    `,
      [req.user.id],
    )
    res.json(usage)
  } catch (error) {
    res.status(500).json({ error: "Error fetching energy usage" })
  }
})

app.get("/api/energy/device-usage", authenticateToken, async (req, res) => {
  try {
    const [usage] = await pool.query(
      `
      SELECT devices.name, SUM(energy_data.energy_usage) as total_usage
      FROM devices
      LEFT JOIN energy_data ON devices.id = energy_data.device_id
      WHERE devices.user_id = ?
      GROUP BY devices.id
    `,
      [req.user.id],
    )
    res.json(usage)
  } catch (error) {
    res.status(500).json({ error: "Error fetching device energy usage" })
  }
})

// Budget routes
app.get("/api/budget", authenticateToken, async (req, res) => {
  try {
    const [budgets] = await pool.query("SELECT * FROM budgets WHERE user_id = ? ORDER BY id DESC LIMIT 1", [
      req.user.id,
    ])
    res.json(budgets[0] || null)
  } catch (error) {
    res.status(500).json({ error: "Error fetching budget" })
  }
})

app.post("/api/budget", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body
    const [result] = await pool.query("INSERT INTO budgets (user_id, amount) VALUES (?, ?)", [req.user.id, amount])
    res.status(201).json({ id: result.insertId, amount })
  } catch (error) {
    res.status(500).json({ error: "Error setting budget" })
  }
})

// Simulated energy data generation (for demo purposes)
setInterval(async () => {
  try {
    const [devices] = await pool.query("SELECT id FROM devices")
    for (const device of devices) {
      const usage = Math.random() * 5 // Random usage between 0 and 5 kWh
      await pool.query("INSERT INTO energy_data (device_id, energy_usage) VALUES (?, ?)", [device.id, usage])
    }
  } catch (error) {
    console.error("Error generating simulated energy data:", error)
  }
}, 3600000) // Generate data every hour

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




// another one
app.post("/api/devices", authenticateToken, async (req, res) => {
  try {
    console.log("Adding device for user:", req.user.id);
    const { name, type } = req.body;
    const [result] = await pool.query("INSERT INTO devices (user_id, name, type) VALUES (?, ?, ?)", [
      req.user.id,
      name,
      type,
    ]);
    console.log("Device added:", result);
    res.status(201).json({ id: result.insertId, name, type });
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ error: "Error adding device" });
  }
});

pool.query("SELECT 1")
  .then(() => {
    console.log("MySQL connected!");
  })
  .catch((error) => {
    console.error("Error connecting to MySQL:", error);
  });
