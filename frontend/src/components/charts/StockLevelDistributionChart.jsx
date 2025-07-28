import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const COLORS = ["#00E1FF", "#0099FF", "#0066FF", "#0033FF"];

const StockLevelDistributionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/")
      .then(res => {
        const products = res.data;
        const ranges = {
          "0-50": 0,
          "51-100": 0,
          "101-200": 0,
          "201+": 0,
        };

        products.forEach(product => {
          const stock = product.stock || 0;
          if (stock <= 50) ranges["0-50"]++;
          else if (stock <= 100) ranges["51-100"]++;
          else if (stock <= 200) ranges["101-200"]++;
          else ranges["201+"]++;
        });

        const chartData = Object.keys(ranges).map(range => ({
          range,
          value: ranges[range],
        }));

        setData(chartData);
      })
      .catch(console.error);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length) return <p className="text-gray-400">No stock distribution data found.</p>;

  return (
    <div className="bg-[#1b1c2e] p-6 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-semibold mb-4">📊 Stock Level Distribution</h2>
      <div className="flex items-center">
        {/* Donut Chart */}
        <div className="w-2/3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="range"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="w-1/3 pl-4 space-y-3">
          {data.map((entry, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="flex-1">{entry.range}</span>
              <span className="text-violet-300">
                {((entry.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockLevelDistributionChart;
