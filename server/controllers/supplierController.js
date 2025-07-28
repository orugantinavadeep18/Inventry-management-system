// import Supplier from "../models/Supplier.js";

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private (use verifyToken middleware)
// controllers/supplierController.js
import Supplier from "../models/Supplier.js";

// @desc    Create a new supplier
// @route   POST /api/suppliers
// controllers/supplierController.js
export const createSupplier = async (req, res) => {
  try {
    console.log("Received request body:", req.body);  // Log incoming data

    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newSupplier = new Supplier({ name, email, phone, address });
    const savedSupplier = await newSupplier.save();

    console.log("Saved to DB:", savedSupplier);  // Log saved doc

    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error("Error in createSupplier:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get all suppliers
// @route   GET /api/suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Fetch Suppliers Error:", error);
    res.status(500).json({ message: "Server error while fetching suppliers" });
  }
};


// @desc    Update an existing supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const updatedSupplier = await Supplier.findByIdAndUpdate(supplierId, req.body, {
      new: true,
    });

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ message: "Failed to update supplier", error: err.message });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
export const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete supplier", error: err.message });
  }
};
