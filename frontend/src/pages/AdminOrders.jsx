import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching admin orders:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2f] p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-violet-400">All Orders (Admin)</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`rounded-2xl p-5 shadow-lg border transition duration-200 ${
                order.status === "completed"
                  ? "bg-green-900/70 border-green-500"
                  : "bg-[#2a2b3d] border-gray-700"
              }`}
            >
              <h2 className="text-xl font-bold text-violet-300 mb-2">
                Order #{order._id.slice(-6).toUpperCase()}
              </h2>

              <p className="text-gray-300">
                Product: <span className="font-medium">{order.product?.name || "N/A"}</span>
              </p>
              <p className="text-gray-300">Customer: {order.customer?.name || "N/A"}</p>
              <p className="text-gray-300">Email: {order.customer?.email || "N/A"}</p>
              <p className="text-gray-300">Quantity: {order.quantity}</p>
              <p className="text-gray-300">Price: ₹{order.product?.price ?? "Unknown"}</p>
              <p className="text-gray-400 mt-2 text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    order.status === "completed" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {order.status || "pending"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
