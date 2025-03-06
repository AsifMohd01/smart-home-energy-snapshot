// "use client"
// import { FaBell, FaBars, FaUser } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"

// const Header = ({ setSidebarOpen }) => {
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     navigate("/login")
//   }

//   return (
//     <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
//       <div className="flex items-center">
//         <button className="text-gray-500 mr-4 md:hidden" onClick={() => setSidebarOpen(true)}>
//           <FaBars size={24} />
//         </button>
//         <h1 className="text-xl font-bold">Energy Monitor</h1>
//       </div>
//       <div className="flex items-center">
//         <button className="text-gray-500 mr-4 relative">
//           <FaBell size={24} />
//           <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
//         </button>
//         <div className="relative group">
//           <button className="flex items-center text-gray-700">
//             <FaUser className="mr-2" />
//             <span>User</span>
//           </button>
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
//             <button
//               onClick={handleLogout}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header

//another code

"use client"
import { useState, useEffect, useRef } from "react"
import { FaBell, FaBars, FaUser } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Header = ({ setSidebarOpen }) => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userName, setUserName] = useState("User")
  const dropdownRef = useRef(null)

  // Fetch username when component mounts
  
 useEffect(() => {
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        setUserName(data.name)
      } else {
        setUserName("Guest")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUserName("Guest")
    }
  }

  fetchUserName()
}, [])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <button className="text-gray-500 mr-4 md:hidden" onClick={() => setSidebarOpen(true)}>
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-bold">Energy Monitor</h1>
      </div>
      <div className="flex items-center">
        {/* Notification Bell */}
        <div className="relative mr-4">
          <FaBell size={24} className="text-gray-500 cursor-pointer" />
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center text-gray-700 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUser className="mr-2" />
            <span>{userName}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

