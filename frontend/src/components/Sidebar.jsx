import React from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaBell, // 🔁 Changed icon to Notifications
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { label: "Products", icon: <FaBoxOpen />, path: "/admin/dashboard/products" },
    { label: "Notifications", icon: <FaBell />, path: "/admin/dashboard/notifications" }, // ✅ Changed this
    { label: "Orders", icon: <FaShoppingCart />, path: "/admin/dashboard/orders" },
    { label: "Supplies", icon: <FaTruck />, path: "/admin/dashboard/supplies" },
    { label: "Users", icon: <FaUsers />, path: "/admin/dashboard/users" },
    { label: "Profile", icon: <FaUserCircle />, path: "/admin/dashboard/profile" },
    { label: "Logout", icon: <FaSignOutAlt />, path: "/admin/dashboard/logout", isLogout: true },
  ];

  const handleNavClick = (item) => {
    if (item.isLogout) {
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      navigate(item.path);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-[#151527] p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-8 text-white">Admin Dashboard</h1>
      <nav className="space-y-6 text-sm font-semibold text-gray-300">
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-4 px-4 py-3 text-base rounded-lg transition-all duration-200 text-left
                  ${item.isLogout
                    ? "text-red-400 hover:text-red-300"
                    : "hover:bg-[#2b2c3b] hover:border-l-4 hover:border-purple-500"
                  }`}
              >
                {item.icon} {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
