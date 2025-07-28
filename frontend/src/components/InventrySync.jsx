// frontend/src/components/InventorySync.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

export default function InventorySync() {
  const [products, setProducts] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    await addDoc(collection(db, "inventory"), { name: newItem });
    setNewItem("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">📦 Realtime Inventory</h2>
      <input value={newItem} onChange={e => setNewItem(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {products.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}
