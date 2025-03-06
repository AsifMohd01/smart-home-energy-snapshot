"use client"

import { useState, useEffect } from "react"
import { FaBolt, FaDollarSign, FaExclamationTriangle } from "react-icons/fa"
import { Line, Pie } from "react-chartjs-2"
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
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = () => {
  const [energyData, setEnergyData] = useState([])
  const [deviceUsage, setDeviceUsage] = useState([])
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [energyResponse, deviceUsageResponse, budgetResponse] = await Promise.all([
          fetch("http://localhost:5000/api/energy/usage", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("http://localhost:5000/api/energy/device-usage", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("http://localhost:5000/api/budget", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ])

        if (!energyResponse.ok || !deviceUsageResponse.ok || !budgetResponse.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const energyData = await energyResponse.json()
        const deviceUsageData = await deviceUsageResponse.json()
        const budgetData = await budgetResponse.json()

        setEnergyData(energyData)
        setDeviceUsage(deviceUsageData)
        setBudget(budgetData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const totalEnergyUsage = energyData.reduce((total, day) => total + day.total_usage, 0)
  console.log("Total Energy Usage:", totalEnergyUsage);
  const estimatedCost = totalEnergyUsage * 0.12 // Assuming $0.12 per kWh
  console.log("Estimated Cost:", estimatedCost);

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
  }

  const pieChartData = {
    labels: deviceUsage.map((device) => device.name),
    datasets: [
      {
        data: deviceUsage.map((device) => device.total_usage),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  }

  return (
    <div className="space-y-6 md:ml-64">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Total Energy Usage</h3>
            <FaBolt className="text-yellow-500" size={24} />
          </div>
          {/* <p className="text-3xl font-bold mt-2">{totalEnergyUsage.toFixed(2)} kWh</p> */}
          <p className="text-3xl font-bold mt-2">
            {isNaN(Number(totalEnergyUsage)) ? "0.00 kWh" : `${Number(totalEnergyUsage).toFixed(2)} kWh`}
          </p>

        </div>


        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Estimated Cost</h3>
            <FaDollarSign className="text-green-500" size={24} />
          </div>
          {/* <p className="text-3xl font-bold mt-2">${estimatedCost.toFixed(2)}</p> */}
          <p className="text-3xl font-bold mt-2">
            {isNaN(Number(estimatedCost)) ? "$0.00" : `$${Number(estimatedCost).toFixed(2)}`}
          </p>

        </div>


        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Energy Budget</h3>
            <FaExclamationTriangle className="text-orange-500" size={24} />
          </div>
          {/* <p className="text-3xl font-bold mt-2">{budget ? `$${budget.amount.toFixed(2)}` : "Not set"}</p> */}
          <p className="text-2xl font-bold">
            {budget && !isNaN(Number(budget.amount))
              ? `$${Number(budget.amount).toFixed(2)}`
              : "Not set"}
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
  )
}

export default Dashboard



// //Another code

// "use client";

// import { useState, useEffect } from "react";
// import { FaBolt, FaDollarSign, FaExclamationTriangle } from "react-icons/fa";
// import { Line, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// const Dashboard = () => {
//   const [energyData, setEnergyData] = useState([]);
//   const [deviceUsage, setDeviceUsage] = useState([]);
//   const [budget, setBudget] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         console.log("Fetching dashboard data...");
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("No token found, user not authenticated.");
//         }

//         const [energyResponse, deviceUsageResponse, budgetResponse] = await Promise.all([
//           fetch("http://localhost:5000/api/energy/usage", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:5000/api/energy/device-usage", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:5000/api/budget", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!energyResponse.ok || !deviceUsageResponse.ok || !budgetResponse.ok) {
//           throw new Error("Failed to fetch dashboard data");
//         }

//         const energyData = await energyResponse.json();
//         const deviceUsageData = await deviceUsageResponse.json();
//         const budgetData = await budgetResponse.json();

//         console.log("Energy Data:", energyData);
//         console.log("Device Usage Data:", deviceUsageData);
//         console.log("Budget Data:", budgetData);

//         setEnergyData(energyData);
//         setDeviceUsage(deviceUsageData);
//         setBudget(budgetData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   // Calculate total energy usage
//   const totalEnergyUsage = energyData.reduce((total, day) => total + (day.total_usage || 0), 0);
//   console.log("Total Energy Usage:", totalEnergyUsage);

//   // Estimated cost calculation
//   const estimatedCost = totalEnergyUsage * 0.12; // Assuming $0.12 per kWh
//   console.log("Estimated Cost:", estimatedCost);

//   const lineChartData = {
//     labels: energyData.map((day) => new Date(day.date).toLocaleDateString()),
//     datasets: [
//       {
//         label: "Energy Usage (kWh)",
//         data: energyData.map((day) => day.total_usage || 0),
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//     ],
//   };

//   const pieChartData = {
//     labels: deviceUsage.map((device) => device.name),
//     datasets: [
//       {
//         data: deviceUsage.map((device) => device.total_usage || 0),
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
//       },
//     ],
//   };

//   // useEffect(() => {
//   //   if (energyData.length > 0) {
//   //     setLineChartData({
//   //       labels: energyData.map((day) => new Date(day.date).toLocaleDateString()),
//   //       datasets: [
//   //         {
//   //           label: "Energy Usage (kWh)",
//   //           data: energyData.map((day) => day.total_usage || 0),
//   //           borderColor: "rgb(75, 192, 192)",
//   //           backgroundColor: "rgba(75, 192, 192, 0.2)",
//   //           tension: 0.1,
//   //           fill: true,
//   //         },
//   //       ],
//   //     });
//   //   }

//   //   if (deviceUsage.length > 0) {
//   //     const colors = deviceUsage.map(
//   //       (_, i) =>
//   //         `hsl(${(i * 60) % 360}, 70%, 50%)` // Generates unique colors
//   //     );

//   //     setPieChartData({
//   //       labels: deviceUsage.map((device) => device.name),
//   //       datasets: [
//   //         {
//   //           data: deviceUsage.map((device) => device.total_usage || 0),
//   //           backgroundColor: colors,
//   //         },
//   //       ],
//   //     });
//   //   }
//   // }, [energyData, deviceUsage]);



//   return (
//     <div className="space-y-6 md:ml-64">
//       <h2 className="text-2xl font-bold">Dashboard</h2>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {/* Total Energy Usage */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Total Energy Usage</h3>
//             <FaBolt className="text-yellow-500" size={24} />
//           </div>
//           <p className="text-3xl font-bold mt-2">
//             {isNaN(Number(totalEnergyUsage)) ? "0.00 kWh" : `${Number(totalEnergyUsage).toFixed(2)} kWh`}
//           </p>
//         </div>

//         {/* Estimated Cost */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Estimated Cost</h3>
//             <FaDollarSign className="text-green-500" size={24} />
//           </div>
//           <p className="text-3xl font-bold mt-2">
//             {isNaN(Number(estimatedCost)) ? "$0.00" : `$${Number(estimatedCost).toFixed(2)}`}
//           </p>
//         </div>

//         {/* Energy Budget */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Energy Budget</h3>
//             <FaExclamationTriangle className="text-orange-500" size={24} />
//           </div>
//           <p className="text-2xl font-bold">
//             {budget && !isNaN(Number(budget.amount))
//               ? `$${Number(budget.amount).toFixed(2)}`
//               : "Not set"}
//           </p>
//           {budget && totalEnergyUsage * 0.12 > budget.amount && (
//             <p className="text-red-500 mt-2">Budget exceeded!</p>
//           )}
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid gap-4 md:grid-cols-2">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold mb-4">Energy Usage Trend</h3>
//           <Line data={lineChartData} />
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold mb-4">Device Energy Usage</h3>
//           <Pie data={pieChartData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

