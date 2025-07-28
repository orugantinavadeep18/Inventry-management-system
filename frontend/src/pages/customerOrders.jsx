import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../assets/login.jpg";

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser) {
      setUser(localUser);
      fetchOrders(localUser._id || localUser.id);
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const res = await axios.get(`https://inventory-backend-rion.onrender.com/api/orders?customerId=${userId}`);
      const activeOrders = res.data.filter((order) => order.status !== "completed");
      setOrders(activeOrders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    }
  };

  const handleRemoveQuantity = async (order) => {
    const qtyToRemove = parseInt(prompt(`Enter quantity to remove (max: ${order.quantity})`), 10);
    if (isNaN(qtyToRemove) || qtyToRemove <= 0 || qtyToRemove > order.quantity) {
      alert("❌ Invalid quantity.");
      return;
    }

    try {
      await axios.post(`https://inventory-backend-rion.onrender.com/api/orders/removeQuantity`, {
        orderId: order._id,
        quantity: qtyToRemove,
      });
      alert("✅ Quantity removed.");
      fetchOrders(user._id || user.id);
    } catch (err) {
      console.error("❌ Error removing quantity:", err);
      alert("❌ Failed to remove quantity.");
    }
  };

  const handleCompleteOrder = async (orderId) => {
  try {
    await axios.post(`https://inventory-backend-rion.onrender.com/api/orders/complete`, { orderId });
    alert("✅ Order completed.");
    // Refetch only incomplete orders
    fetchOrders(user._id || user.id);
  } catch (err) {
    console.error("❌ Error completing order:", err);
    alert("❌ Failed to complete order.");
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 flex flex-col items-center text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-violet-300 text-center">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-300 text-center">No orders found.</p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#2a2b3ddc] backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col"
              >
                <h2 className="text-xl font-semibold text-white">
                  {order.product?.name || "Unnamed Product"}
                </h2>
                <p className="text-sm text-gray-300">Price: ₹{order.product?.price ?? "Unknown"}</p>
                <p className="text-sm text-gray-300">Quantity: {order.quantity}</p>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleRemoveQuantity(order)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                  >
                    Remove Quantity
                  </button>
                  <button
                    onClick={() => handleCompleteOrder(order._id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrder;
