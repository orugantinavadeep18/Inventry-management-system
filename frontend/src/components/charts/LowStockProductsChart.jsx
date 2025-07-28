import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#a855f7", "#ec4899"]; // Purple-pink palette

const LowStockProductsChart = () => {
  const [lowStockData, setLowStockData] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get("https://inventory-backend-rion.onrender.com/api/products");
        const threshold = 10;
        const lowStock = res.data.filter((p) => p.stock <= threshold);
        const otherStock = res.data.filter((p) => p.stock > threshold);

        setLowStockData([
          { name: "Low Stock", value: lowStock.length },
          { name: "Sufficient Stock", value: otherStock.length },
        ]);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    };

    fetchLowStock();
  }, []);

  const total = lowStockData.reduce((acc, item) => acc + item.value, 0);
  const centerLabel = lowStockData.find((d) => d.name === "Low Stock");

  return (
    <div className="bg-[#1e1e2f] p-4 rounded-xl shadow-lg text-white w-full">
      <h2 className="text-lg font-semibold mb-4">Low Stock vs Sufficient Stock</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={lowStockData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {lowStockData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#2a2b3d", borderRadius: "6px", border: "none" }}
            labelStyle={{ color: "#fff" }}
          />
          {/* Center label */}
          {centerLabel && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-red-400 text-sm"
            >
              {centerLabel.value} Low
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        {lowStockData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-white">
              {entry.name} ({((entry.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockProductsChart;
