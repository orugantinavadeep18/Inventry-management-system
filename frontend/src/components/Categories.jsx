import React, { useState, useEffect } from "react";
import axios from "axios";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

 const fetchCategories = async () => {
  try {
    const token = localStorage.getItem("pos-token");

    if (!token) {
      setErrorMsg("No token found. Please login.");
      return;
    }

    const response = await axios.get("http://localhost:5000/api/category/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data?.success && Array.isArray(response.data.categories)) {
      setCategories(response.data.categories);
      setErrorMsg("");
    } else {
      setErrorMsg(response.data?.message || "Failed to load categories.");
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    if (error.response?.status === 403) {
      setErrorMsg("Invalid or expired token. Please login again.");
    } else {
      setErrorMsg("Server error while loading categories.");
    }
  }
};


  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("pos-token");

    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    try {
      const payload = {
       name: categoryName,            // ✅ match backend
       description: categoryDescription
      };

      const url = editingId
        ? `http://localhost:5000/api/category/update/${editingId}`
        : "http://localhost:5000/api/category/add";

      const method = editingId ? axios.put : axios.post;

      const response = await method(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert(editingId ? "Category updated!" : "Category added!");
        resetForm();
        fetchCategories();
      } else {
        alert("Operation failed.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Something went wrong. Check server.");
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setEditingId(category._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("pos-token");

    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/category/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          alert("Category deleted.");
          fetchCategories();
        } else {
          alert("Delete failed.");
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0f0f1c]">
  <h1 className="text-3xl font-bold mb-8 text-white">Category Management</h1>

  {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Add/Edit Form */}
    <div className="bg-[#1e1e2f] p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Category" : "Add Category"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          className="w-full px-4 py-2 bg-[#2a2a3b] text-white border border-gray-600 rounded-md focus:outline-none"
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category Description"
          value={categoryDescription}
          className="w-full px-4 py-2 bg-[#2a2a3b] text-white border border-gray-600 rounded-md focus:outline-none"
          onChange={(e) => setCategoryDescription(e.target.value)}
          required
        />
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>

    {/* Category List */}
    <div className="bg-[#1e1e2f] p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
      {categories.length === 0 ? (
        <p className="text-gray-400">No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center bg-[#2a2a3b] p-4 rounded-md"
            >
              <div>
                <p className="font-bold text-white">{cat.name}</p>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>
  );
};

export default Categories;
