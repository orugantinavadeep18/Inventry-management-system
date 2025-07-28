import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUserCircle, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from "axios";
import bgImage from "../assets/login.jpg";

const CustomerDashboard = () => {
  const [user, setUser] = useState({ name: "Customer", email: "customer@example.com" });
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser && localUser.role === "customer") {
      setUser(localUser);
      fetchCustomerOrders(localUser._id);
    }
  }, []);

  const fetchCustomerOrders = async (userId) => {
    try {
      const res = await axios.get(`https://inventory-backend-rion.onrender.com/api/orders/customer/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start p-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-[#1e1e2fcc] rounded-2xl p-8 shadow-2xl text-white w-full max-w-6xl relative">
        
        {/* 🔴 Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow"
        >
          Logout
        </button>

        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => navigate("/customer/orders")}
            className="cursor-pointer bg-[#2a2b3d] rounded-2xl p-6 shadow-lg flex items-center gap-4 hover:bg-[#383951] transition"
          >
            <div className="text-purple-400 text-4xl">
              <FaShoppingCart />
            </div>
            <div>
              <h2 className="text-xl font-semibold">My Orders</h2>
              <p className="text-gray-400 text-sm">View your past and current orders</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/customer/profile")}
            className="cursor-pointer bg-[#2a2b3d] rounded-2xl p-6 shadow-lg flex items-center gap-4 hover:bg-[#383951] transition"
          >
            <div className="text-green-400 text-4xl">
              <FaUserCircle />
            </div>
            <div>
              <h2 className="text-xl font-semibold">My Profile</h2>
              <p className="text-gray-400 text-sm">Manage your personal information</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/customer/products")}
            className="cursor-pointer bg-[#2a2b3d] rounded-2xl p-6 shadow-lg flex items-center gap-4 hover:bg-[#383951] transition"
          >
            <div className="text-yellow-400 text-4xl">
              <FaBoxOpen />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Browse Products</h2>
              <p className="text-gray-400 text-sm">Explore available items</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <h2 className="text-2xl font-semibold mb-4">My Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#2a2b3d] rounded-xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-purple-300 mb-2">
                  Order #{order._id.slice(-6).toUpperCase()} —{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </h3>

                {order.status === "completed" && (
                  <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded mb-2">
                    Completed
                  </span>
                )}

                <ul className="text-gray-300 ml-4 list-disc">
                  {/* fallback if items is missing */}
                  {(order.items || [{ product: order.product, quantity: order.quantity }]).map((item, i) => (
                    <li key={i}>
                      {item.product?.name || "Unknown Product"} — Qty: {item.quantity} — ₹
                      {(item.product?.price || 0) * item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-green-400 mt-2 font-semibold">
                  Total: ₹
                  {(order.items || [{ product: order.product, quantity: order.quantity }])
                    .reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
