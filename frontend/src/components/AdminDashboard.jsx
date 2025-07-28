import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router";

// 📊 Chart Components
import MonthlyInventoryChart from "./charts/MonthlyInventoryChart";
import StockLevelDistributionChart from "./charts/StockLevelDistributionChart";
// import OrderCompletionTrendsChart from "./charts/OrderCompletionTrendsChart";
import OrdersSummaryBox from "./charts/OrdersSummaryBox";
import LowStockProductsChart from "./charts/LowStockProductsChart";
import WeeklyInventoryActivity from "./charts/WeeklyInventoryActivity";
import AdminNotification from "../pages/AdminNotifications";
import NotificationBell from "./NotificationBell";

const Dashboard = () => {
  const location = useLocation();
  const isMainDashboard =
    location.pathname === "/admin/dashboard" || location.pathname === "/admin/dashboard/";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/03/60/94/96/360_F_360949695_Q5UDMDU9Rm1kbMpXcvKcOtAGRFWpvmsB.jpg')",
      }}
    >
      <div className="w-[90%] max-w-[1600px] bg-[#0f0f1d]/90 backdrop-blur-md rounded-2xl shadow-2xl text-white flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {isMainDashboard ? (
            <>
              <h1 className="text-3xl font-bold mb-8">📊 Inventory Dashboard</h1>
              <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Other dashboard sections */}
      <NotificationBell/>
    </div>

              {/* 🔷 Row 1: Monthly Inventory Movement */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                <div className="col-span-1 md:col-span-2 bg-[#2a2b3d] rounded-xl p-4 shadow-lg">
                  <MonthlyInventoryChart />
                </div>
                <div className="bg-[#2a2b3d] rounded-xl p-4 shadow-lg">
                  <WeeklyInventoryActivity />
                </div>
              </div>

              {/* 🔷 Row 2: Completion Trends + Stock Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#2a2b3d] rounded-xl p-4 shadow-lg">
                 <LowStockProductsChart />
                </div>
                <div className="bg-[#2a2b3d] rounded-xl p-4 shadow-lg">
                  <StockLevelDistributionChart />
                </div>
              </div>

              {/* 🔷 Row 3: Low Stock */}
              <div className="grid grid-cols-1">
                <div className="bg-[#2a2b3d] rounded-xl p-4 shadow-lg">
                  <OrdersSummaryBox/>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
