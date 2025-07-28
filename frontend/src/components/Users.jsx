import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/all");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/add", formData);
      fetchUsers(); // Refresh user list
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
      fetchUsers(); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 text-white">
      {/* Add User Form */}
      <div className="bg-[#1f1f2e] p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={addUser} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-[#2d2d44] px-4 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#2d2d44] px-4 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-[#2d2d44] px-4 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange}
            className="bg-[#2d2d44] px-4 py-2 rounded-lg focus:outline-none"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-[#2d2d44] px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium"
          >
            Add User
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Users Management</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="mb-4 w-full bg-[#2d2d44] px-4 py-2 rounded-lg focus:outline-none"
        />
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-[#2d2d44]">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-[#3a3a58]">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
