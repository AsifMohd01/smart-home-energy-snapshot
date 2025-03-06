"use client"
import { Link, useLocation } from "react-router-dom"
import { FaHome, FaBolt, FaMoneyBillWave, FaTimes } from "react-icons/fa"

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()

  const routes = [
    { name: "Dashboard", path: "/dashboard", icon: FaHome },
    { name: "Devices", path: "/devices", icon: FaBolt },
    { name: "Set Budget", path: "/budget", icon: FaMoneyBillWave },
  ]

  return (
    <>
      <aside
        className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed inset-y-0 left-0 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out md:translate-x-0 z-20`}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-semibold">Energy Monitor</span>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>
        <nav>
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`flex items-center py-2 px-4 rounded transition-colors duration-200 ${
                location.pathname === route.path
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <route.icon className="mr-3 h-6 w-6" />
              {route.name}
            </Link>
          ))}
        </nav>
      </aside>
      {open && <div className="fixed inset-0 z-10 bg-black opacity-50 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}

export default Sidebar

