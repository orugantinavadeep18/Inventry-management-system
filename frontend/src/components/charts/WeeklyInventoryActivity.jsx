import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", added: 20, removed: 12 },
  { day: "Tue", added: 30, removed: 18 },
  { day: "Wed", added: 15, removed: 22 },
  { day: "Thu", added: 40, removed: 25 },
  { day: "Fri", added: 35, removed: 10 },
  { day: "Sat", added: 25, removed: 15 },
  { day: "Sun", added: 10, removed: 5 },
];

const WeeklyInventoryActivity = () => (
  <div className="bg-[#1a1a2e] p-4 rounded-xl shadow-lg">
    <h2 className="text-white text-xl font-semibold mb-4">📈 Weekly Inventory Activity</h2>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="day" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#555" }} />
        <Line type="monotone" dataKey="added" stroke="#00d4ff" strokeWidth={2} />
        <Line type="monotone" dataKey="removed" stroke="#ff4c60" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default WeeklyInventoryActivity;
