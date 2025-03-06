"use client";

import { useState, useEffect } from "react";
import { FaBolt, FaDollarSign, FaExclamationTriangle } from "react-icons/fa";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [energyData, setEnergyData] = useState([]);
  const [deviceUsage, setDeviceUsage] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hrData, sethrData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [energyResponse, hourlyUsageResponse, deviceUsageResponse, budgetResponse] = await Promise.all([
          fetch("http://localhost:5000/api/energy/usage", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("http://localhost:5000/api/energy/usage-hours", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("http://localhost:5000/api/energy/device-usage", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("http://localhost:5000/api/budget", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        if (!energyResponse.ok || !deviceUsageResponse.ok || !budgetResponse.ok || !hourlyUsageResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const energyData = await energyResponse.json();
        const hourData = await hourlyUsageResponse.json();
        const deviceUsageData = await deviceUsageResponse.json();
        const budgetData = await budgetResponse.json();

        setEnergyData(Array.isArray(energyData) ? energyData : []);
        sethrData(Array.isArray(hourData) ? hourData : []);
        setDeviceUsage(Array.isArray(deviceUsageData) ? deviceUsageData : []);
        setBudget(budgetData || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const totalEnergyUsage = energyData.length
    ? energyData.reduce((total, day) => total + (parseFloat(day.total_usage) || 0), 0)
    : 0;

  const estimatedCost = totalEnergyUsage * 0.12; // Assuming $0.12 per kWh

  const lineChartData = {
    labels: energyData.map((day) => new Date(day.date).toLocaleDateString()),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: energyData.map((day) => day.total_usage),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: deviceUsage.map((device) => device.name),
    datasets: [
      {
        data: deviceUsage.map((device) => device.total_usage),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  return (
    <div className="space-y-6 md:ml-64">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Total Energy Usage</h3>
            <FaBolt className="text-yellow-500" size={24} />
          </div>
          <p className="text-3xl font-bold mt-2">
            {totalEnergyUsage > 0 ? `${totalEnergyUsage.toFixed(2)} kWh` : "0.00 kWh"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Estimated Cost</h3>
            <FaDollarSign className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold mt-2">
            {estimatedCost > 0 ? `$${estimatedCost.toFixed(2)}` : "$0.00"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Energy Budget</h3>
            <FaExclamationTriangle className="text-orange-500" size={24} />
          </div>
          <p className="text-2xl font-bold">
            {budget && !isNaN(Number(budget.amount)) ? `$${Number(budget.amount).toFixed(2)}` : "Not set"}
          </p>

          {budget && totalEnergyUsage * 0.12 > budget.amount && <p className="text-red-500 mt-2">Budget exceeded!</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Energy Usage Trend</h3>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Device Energy Usage</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
