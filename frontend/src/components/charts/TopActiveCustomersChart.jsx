import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const TopActiveCustomersChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  axios.get("/api/users/top-active")
    .then(res => {
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        console.error("Expected array but got:", res.data);
        setData([]);
      }
    })
    .catch(err => {
      console.error("Fetch failed:", err);
      setData([]);
    });
}, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">👤 Top Active Admin/Staff Users</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="activity" fill="#36A2EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopActiveCustomersChart;
