const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../db")

exports.register = async (req, res) => {
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
}

exports.login = async (req, res) => {
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
}

