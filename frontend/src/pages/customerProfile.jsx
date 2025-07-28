import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../assets/login.jpg"; // Make sure this path is correct

const CustomerProfile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        address: storedUser.address || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const userId = user._id || user.id;
    if (!userId) {
      alert("❌ Cannot update: user ID missing.");
      return;
    }

    try {
      const res = await axios.put(`https://inventory-backend-rion.onrender.com/api/users/${userId}`, formData);
      alert("✅ Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-[#1e1e2fcc] backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-violet-400">User Profile</h1>

        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-[#1e1e2f] text-white border ${
              editMode ? "border-violet-500" : "border-gray-600"
            }`}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-[#1e1e2f] text-white border ${
              editMode ? "border-violet-500" : "border-gray-600"
            }`}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            disabled={!editMode}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded bg-[#1e1e2f] text-white border ${
              editMode ? "border-violet-500" : "border-gray-600"
            }`}
          />
        </div>

        {editMode ? (
          <button
            onClick={handleSave}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
