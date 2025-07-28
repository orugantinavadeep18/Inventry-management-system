import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, unique: true },
});

 const Supplier = mongoose.model('Supplier', supplierSchema);
 export default Supplier;
