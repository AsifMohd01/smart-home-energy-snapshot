const pool = require("../db")

exports.getEnergyUsage = async (req, res) => {
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
}

