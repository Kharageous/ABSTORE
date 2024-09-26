import React, { useState } from "react";
import { motion } from "framer-motion";
import bg from "../assets/bg.jpeg";
import {
  FaUsers,
  FaBox,
  FaChartBar,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import {
  UserStats,
  Messages,
  Orders,
  ProductManagement,
  Dashboard,
  Logout,
} from "../components/index"; // Correct import path

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-red-600 text-white text-3xl sm:text-4xl flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full bg-primary text-secondary flex flex-col transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-full sm:w-64 z-30`} // Full width on small screens, fixed width on larger screens
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ overflow: "hidden" }} // Ensure the sidebar does not show any overflow
      >
        <div className="p-4 text-2xl font-bold">Admin Dashboard</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { name: "Dashboard", icon: <FaChartBar />, section: "dashboard" },
              {
                name: "Products Management",
                icon: <FaBox />,
                section: "products",
              },
              { name: "Orders", icon: <FaBox />, section: "orders" },
              { name: "Users", icon: <FaUsers />, section: "users" },
              { name: "Messages", icon: <FaEnvelope />, section: "messages" },
              { name: "Logout", icon: <FaSignOutAlt />, section: "logout" },
            ].map(({ name, icon, section }) => (
              <li key={section}>
                <button
                  className={`flex items-center w-full p-2 rounded-md text-secondary hover:bg-hover ${
                    activeSection === section ? "bg-active" : ""
                  }`}
                  onClick={() => setActiveSection(section)}
                  aria-label={name}
                >
                  {icon}
                  <span className="ml-2">{name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        className={`flex-1  overflow-y-auto ${
          isSidebarOpen ? "ml-0" : "ml-0"
        } transition-all duration-300 z-20`} // Ensure content is below sidebar
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "products" && <ProductManagement />}
        {activeSection === "orders" && <Orders />}
        {activeSection === "users" && <UserStats />}
        {activeSection === "messages" && <Messages />}
        {activeSection === "logout" && <Logout />}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
