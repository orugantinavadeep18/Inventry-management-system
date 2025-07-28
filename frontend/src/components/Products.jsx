import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://inventory-backend-rion.onrender.com"); // Adjust to match your backend

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    price: "",
    stock: "",
    category: "",
    supplier: "",
    image: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://inventory-backend-rion.onrender.com0/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();

    socket.on("products:updated", () => {
      console.log("🔄 Products updated via socket");
      fetchProducts();
    });

    return () => {
      socket.off("products:updated");
      socket.disconnect();
    };
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setForm({
        _id: product._id,
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category?._id || product.category || "",
        supplier: product.supplier || "",
        image: product.image || "",
      });
    } else {
      setForm({
        _id: null,
        name: "",
        price: "",
        stock: "",
        category: "",
        supplier: "",
        image: "",
      });
    }
    setIsOpen(true);
  };

  const saveProduct = async () => {
    try {
      if (form._id) {
        await axios.put(`https://inventory-backend-rion.onrender.com/api/products/${form._id}`, form);
      } else {
        await axios.post("https://inventory-backend-rion.onrender.com/api/products", form);
      }
      setIsOpen(false);
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://inventory-backend-rion.onrender.com/api/products/${id}`);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="p-8 bg-[#0f0c22] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#a21caf] hover:bg-[#86198f] text-white px-4 py-2 rounded-xl transition"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="bg-[#1b1b2f] rounded-2xl shadow-md overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="text-left text-slate-300 border-b border-slate-600">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-slate-500 p-4">
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-slate-700 hover:bg-[#26263a] transition"
                >
                  <td className="p-4">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium text-white">{product.name}</td>
                  <td className="p-4 text-slate-300">{product.category}</td>
                  <td className="p-4 text-slate-300">{product.supplier}</td>
                  <td className="p-4 text-slate-300">₹{product.price}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10
                          ? "bg-green-500 text-white"
                          : product.stock > 0
                          ? "bg-yellow-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openModal(product)}
                      className="text-yellow-400 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-30">
          <Dialog.Panel className="bg-[#1b1b2f] p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              {form._id ? "Edit Product" : "Add Product"}
            </Dialog.Title>
            <div className="space-y-3">
              {["name", "price", "stock", "category", "supplier", "image"].map((field) => (
                <input
                  key={field}
                  type={field === "price" || field === "stock" ? "number" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full bg-transparent border border-slate-600 text-white rounded-md px-3 py-2 placeholder-slate-400"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveProduct}
                className="px-4 py-2 bg-[#a21caf] hover:bg-[#86198f] text-white rounded-md"
              >
                {form._id ? "Update" : "Add"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Product;
