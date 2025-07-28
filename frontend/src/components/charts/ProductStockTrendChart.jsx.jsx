// components/charts/ProductStockTrendChart.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";

const ProductStockTrendChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/products/stock-trend")
      .then(res => setData(res.data))
      .catch(err => console.error("Stock trend error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">📉 Product Stock Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="stock" stroke="#00f0ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductStockTrendChart;
