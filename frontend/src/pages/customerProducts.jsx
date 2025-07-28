import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../assets/login.jpg"; // Adjust the path if needed

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = () => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser) setUser(localUser);
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://inventory-backend-rion.onrender.com/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchUser();
    fetchProducts();
  }, []);

  const handleOrder = async (product) => {
    if (!user || !(user._id || user.id)) {
      alert("⚠️ Please log in to place an order.");
      return;
    }

    const quantity = parseInt(
      prompt(`Enter quantity for "${product.name}" (Max: ${product.stock})`),
      10
    );

    if (isNaN(quantity) || quantity <= 0) {
      alert("❌ Invalid quantity.");
      return;
    }

    if (quantity > product.stock) {
      alert(`❌ Quantity exceeds available stock (${product.stock}).`);
      return;
    }

    try {
      const orderData = {
        customerId: user._id || user.id,
        productId: product._id,
        quantity,
      };

      await axios.post("https://inventory-backend-rion.onrender.com/api/products/buy", orderData);
      alert("✅ Order placed successfully!");

      const updated = await axios.get("https://inventory-backend-rion.onrender.com/api/products");
      setProducts(updated.data);
    } catch (err) {
      console.error("❌ Order error:", err);
      const msg = err.response?.data?.message || "Failed to place order.";
      alert(`❌ ${msg}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-6 text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-violet-300">Available Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-300">No products available.</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-[#2a2b3ddc] backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col"
              >
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `https://inventory-backend-rion.onrender.com/uploads/${product.image}`
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
                <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-400 text-sm mb-1">Price: ₹{product.price}</p>
                <p className="text-gray-400 text-sm mb-3">Stock: {product.stock}</p>
                <button
                  onClick={() => handleOrder(product)}
                  className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full"
                >
                  Order
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
