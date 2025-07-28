import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import axios from "axios";

const OrdersRestocksBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/inventory/activity")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.error("Invalid data format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">📦 Orders Per Day</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#FF6384" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersRestocksBarChart;
