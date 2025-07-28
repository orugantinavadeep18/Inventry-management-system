import { BrowserRouter as Router, Routes, Route } from 'react-router'; // use `react-router-dom`, NOT `react-router`
import './App.css';
import Root from './utils/root';
import Login from './pages/login';
import ProtectedRoutes from './utils/ProtectedRoutes';
// import Dashboard from './pages/Dashboard';
import Dashboard from './components/AdminDashboard';
import Categories from './components/Categories';
import Product from './components/Products';
import Suppliers from './components/Suppliers';
import Users from './components/Users';
import CustomerDashboard from "./pages/customerDashboard";
import CustomerProducts from './pages/customerProducts'; 
import CustomerOrders from './pages/customerOrders';
import CustomerProfile from './pages/customerProfile';
import AdminOrders from './pages/AdminOrders';
import AdminProfile from './pages/AdminProfile';
import AdminNotifications from './pages/AdminNotifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />

        
        <Route path="/login" element={<Login />} />
 {/* ✅ Fixed typo: requireRole instead of reuireRole */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoutes requireRole={["admin"]}>
              <Dashboard/>
            </ProtectedRoutes>
          }
        >
          <Route
            index
            element={<h1>Summary of Dashboard</h1>}
            />
            <Route
             path="notifications"
            element={<AdminNotifications/>}
            />
            <Route
             path="products"
            element={<Product/>}
            />
            <Route
             path="orders"
            element={<AdminOrders/>}
            />
           <Route
             path="supplies"
            element={<Suppliers/>}
            />
            <Route
             path="Users"
            element={<Users/>}
            /> 
            <Route
             path="logout"
            element={<h1>logout</h1>}
            />
            <Route
             path="profile"
            element={<AdminProfile/>}
            />

        </Route>

        {/* Optional: Add protection for customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoutes requireRole={["customer", "user"]}>
            <CustomerDashboard/>
            </ProtectedRoutes>
          }
        />
        <Route
  path="/customer/products"
  element={
    <ProtectedRoutes requireRole={["customer", "user"]}>
      <CustomerProducts />
    </ProtectedRoutes>
  }
/>
        <Route
  path="/customer/orders"
  element={
    <ProtectedRoutes requireRole={["customer", "user"]}>
      <CustomerOrders/> 
    </ProtectedRoutes>
  }
/>

        <Route
  path="/customer/profile"
  element={
    <ProtectedRoutes requireRole={["customer", "user"]}>
      <CustomerProfile/>
    </ProtectedRoutes>
  }
/>



        <Route
          path="/unauthorized"
          element={<p className="font-bold text-3xl mt-20 ml-20">Unauthorized</p>}
        />


      </Routes>
    </Router>
  );
}

export default App;
