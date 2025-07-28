import React, { useState, useEffect } from "react";
import axios from "axios";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    }
  };

  const openModal = (supplier = null) => {
    setEditingSupplier(supplier);
    setFormData(supplier || { name: "", email: "", phone: "", address: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingSupplier
      ? `http://localhost:5000/api/suppliers/${editingSupplier._id}`
      : "http://localhost:5000/api/suppliers";

    try {
      const method = editingSupplier ? "put" : "post";
      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      fetchSuppliers();
      closeModal();
    } catch (err) {
      console.error("Failed to submit supplier", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier", err);
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-[#0D0B1F] text-white">
      <div className="bg-[#1B192E] rounded-xl shadow-md p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">Supplier Management</h2>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            className="bg-transparent border border-gray-500 placeholder-gray-400 px-4 py-2 rounded-md w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-[#A020F0] hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-md transition"
            onClick={() => openModal()}
          >
            + Add
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-600 text-white">
            <thead className="bg-[#2A273D] text-sm text-gray-200">
              <tr>
                <th className="p-3 border border-gray-700">#</th>
                <th className="p-3 border border-gray-700 text-left">Name</th>
                <th className="p-3 border border-gray-700 text-left">Email</th>
                <th className="p-3 border border-gray-700 text-left">Phone</th>
                <th className="p-3 border border-gray-700 text-left">Address</th>
                <th className="p-3 border border-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((s, index) => (
                  <tr key={s._id} className="hover:bg-[#2A273D] text-sm">
                    <td className="p-3 border border-gray-700 text-center">{index + 1}</td>
                    <td className="p-3 border border-gray-700">{s.name}</td>
                    <td className="p-3 border border-gray-700">{s.email}</td>
                    <td className="p-3 border border-gray-700">{s.phone}</td>
                    <td className="p-3 border border-gray-700">{s.address}</td>
                    <td className="p-3 border border-gray-700 text-center space-x-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md"
                        onClick={() => openModal(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-400">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-[#1B192E] p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-white">
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="bg-transparent border border-gray-500 placeholder-gray-400 px-4 py-2 w-full rounded-md text-white focus:outline-none focus:ring focus:ring-purple-500"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-transparent border border-gray-500 placeholder-gray-400 px-4 py-2 w-full rounded-md text-white focus:outline-none focus:ring focus:ring-purple-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="bg-transparent border border-gray-500 placeholder-gray-400 px-4 py-2 w-full rounded-md text-white focus:outline-none focus:ring focus:ring-purple-500"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="address"
                placeholder="Address"
                className="bg-transparent border border-gray-500 placeholder-gray-400 px-4 py-2 w-full rounded-md text-white focus:outline-none focus:ring focus:ring-purple-500"
                value={formData.address}
                onChange={handleInputChange}
                required
              ></textarea>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  {editingSupplier ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
