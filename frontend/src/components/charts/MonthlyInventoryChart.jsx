import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fakeMonthlyData = [
  { month: "Jan", stockAdded: 120, stockUsed: 80 },
  { month: "Feb", stockAdded: 100, stockUsed: 90 },
  { month: "Mar", stockAdded: 130, stockUsed: 110 },
  { month: "Apr", stockAdded: 150, stockUsed: 95 },
  { month: "May", stockAdded: 140, stockUsed: 100 },
  { month: "Jun", stockAdded: 160, stockUsed: 120 },
];

const MonthlyInventoryChart = () => (
  <div>
    <h2 className="text-lg font-semibold mb-4">📅 Monthly Inventory Movement</h2>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={fakeMonthlyData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Line type="monotone" dataKey="stockAdded" stroke="#00C49F" />
        <Line type="monotone" dataKey="stockUsed" stroke="#FF8042" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlyInventoryChart;
