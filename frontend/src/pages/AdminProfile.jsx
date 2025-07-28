import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import bgImage from "../assets/login.jpg";

const AdminProfile = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "admin" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser && localUser.role === "admin") {
      setUser(localUser);
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        name: user.name,
        email: user.email,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-start p-8"
    //   style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-[#1e1e2fcc] rounded-2xl p-10 shadow-2xl text-white w-full max-w-3xl relative">
        {/* Logout Button */}
        {/* <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow"
        >
          Logout
        </button> */}

        <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full bg-[#2a2b3d] text-white rounded-xl p-3 mt-1 ${
                isEditing ? "border border-purple-500" : "border border-transparent"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full bg-[#2a2b3d] text-white rounded-xl p-3 mt-1 ${
                isEditing ? "border border-purple-500" : "border border-transparent"
              }`}
            />
          </div>

          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
