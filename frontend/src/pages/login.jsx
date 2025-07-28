import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import image from "../assets/login.jpg"

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // ✅ used in payload
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await axios.post("https://inventory-backend-rion.onrender.com/api/auth/login", {
      email,
      password,
    });

    console.log(response.data);

    if (response.data.success) {
      // ✅ Store user in localStorage so CustomerProducts works
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Save user and token in context (for auth protection, etc.)
      login(response.data.user, response.data.token);

      // Redirect based on role
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } else {
      setError(response.data.message || "Login failed");
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};



return (
  <div
    className="min-h-screen relative bg-cover bg-no-repeat bg-center px-4"
   style={{ backgroundImage: `url(${image})` }}
  >
    {/* Title at top-left */}
    <div className="absolute top-6 left-6">
      <h1 className="text-white text-3xl md:text-4xl font-extrabold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-fade-in">
        Inventory Management System
      </h1>
    </div>

    {/* Centered Login Card */}
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 border border-white/30 backdrop-blur-lg rounded-xl shadow-2xl px-8 py-10 max-w-md w-full text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-300 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email ID"
              className="w-full px-4 py-3 bg-white/20 rounded-full placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/20 rounded-full placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-white/80">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-purple-500" />
              Remember me
            </label>
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 hover:from-purple-600 hover:to-indigo-400 transition-all font-semibold ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-white/80 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="#" className="underline text-white font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  </div>
);

};

export default Login;

