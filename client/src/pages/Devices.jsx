"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaTrash } from "react-icons/fa"

const Devices = () => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: "", type: "" })

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/devices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch devices")
      }
      const data = await response.json()
      setDevices(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching devices:", err)
      setError("Failed to load devices. Please try again later.")
      setLoading(false)
    }
  }

  const handleAddDevice = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newDevice),
      })
      if (!response.ok) {
        throw new Error("Failed to add device")
      }
      setShowAddModal(false)
      setNewDevice({ name: "", type: "" })
      fetchDevices()
    } catch (err) {
      console.error("Error adding device:", err)
      setError("Failed to add device. Please try again.")
    }
  }

  const handleDeleteDevice = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/devices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to delete device")
      }
      fetchDevices()
    } catch (err) {
      console.error("Error deleting device:", err)
      setError("Failed to delete device. Please try again.")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6 lg:ml-64 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Devices</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus className="inline mr-2" /> Add Device
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <div key={device.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold">{device.name}</h3>
            <p className="text-gray-600 mt-2">{device.type}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="text-red-500 hover:text-red-700 transition duration-300"
                onClick={() => handleDeleteDevice(device.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Device</h3>
            <input
              type="text"
              placeholder="Device Name"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDevice.name}
              onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Device Type"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDevice.type}
              onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                onClick={handleAddDevice}
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Devices

