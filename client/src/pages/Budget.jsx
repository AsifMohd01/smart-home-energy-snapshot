"use client"

import { useState, useEffect } from "react"
import { FaMoneyBillWave } from "react-icons/fa"

const Budget = () => {
  const [budget, setBudget] = useState(null)
  const [newBudget, setNewBudget] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBudget()
  }, [])

  const fetchBudget = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budget", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch budget")
      }
      const data = await response.json()
      setBudget(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching budget:", err)
      setError("Failed to load budget. Please try again later.")
      setLoading(false)
    }
  }

  const handleSetBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: Number.parseFloat(newBudget) }),
      })
      if (!response.ok) {
        throw new Error("Failed to set budget")
      }
      fetchBudget()
      setNewBudget("")
    } catch (err) {
      console.error("Error setting budget:", err)
      setError("Failed to set budget. Please try again.")
    }
  }
  


  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6 lg:ml-64">
      <h2 className="text-2xl font-bold">Energy Budget</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Budget</h3>
          <FaMoneyBillWave className="text-green-500" size={24} />
        </div>
        {/* <p className="text-3xl font-bold">{budget ? `$${budget.amount.toFixed(2)}` : "Not set"}</p> */}
      
        <p className="text-3xl font-bold">
          {budget && budget.amount
            ? `$${parseFloat(budget.amount).toFixed(2)}`
            : "Not set"}
        </p>
      </div>


      <form onSubmit={handleSetBudget} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Set New Budget</h3>
        <div className="flex items-center">
          <input
            type="number"
            step="0.01"
            placeholder="Enter budget amount"
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300"
          >
            Set Budget
          </button>
        </div>
      </form>
    </div>
  )
}

export default Budget

