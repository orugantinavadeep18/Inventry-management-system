import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersSummaryBox = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get("https://inventory-backend-rion.onrender.com/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching admin orders:", err);
    }
  };

  return (
    <div className="min-md: bg-[#1e1e2f] p-6 text-white">
      <h1 className="text-3xl font-bold mb-4 text-violet-400">Recent Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders available.</p>
      ) : (
        <div
          className="overflow-y-auto rounded-lg pr-2"
          style={{
            maxHeight: "320px", // ⬅️ Adjusted to fit only 2 cards
          }}
        >
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`rounded-lg p-6 shadow-md border transition duration-200 ${
                  order.status === "completed"
                    ? "bg-green-900/70 border-green-500"
                    : "bg-[#2a2b3d] border-gray-700"
                }`}
              >
                <h2 className="text-lg font-bold text-violet-300 mb-1">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <p className="text-gray-300 text-sm">
                  Product:{" "}
                  <span className="font-medium">{order.product?.name || "N/A"}</span>
                </p>
                <p className="text-gray-300 text-sm">
                  Customer: {order.customer?.name || "N/A"}
                </p>
                <p className="text-gray-300 text-sm">Quantity: {order.quantity}</p>
                <p className="text-sm mt-2 text-gray-400">
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
        </div>
      )}
    </div>
  );
};

export default OrdersSummaryBox;
