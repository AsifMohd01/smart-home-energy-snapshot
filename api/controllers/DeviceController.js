const pool = require("../db")

exports.getAllDevices = async (req, res) => {
  try {
    const [devices] = await pool.query("SELECT * FROM devices WHERE user_id = ?", [req.user.id])
    res.json(devices)
  } catch (error) {
    res.status(500).json({ error: "Error fetching devices" })
  }
}

exports.addDevice = async (req, res) => {
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
}

exports.deleteDevice = async (req, res) => {
  try {
    await pool.query("DELETE FROM devices WHERE id = ? AND user_id = ?", [req.params.id, req.user.id])
    res.json({ message: "Device deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Error deleting device" })
  }
}

