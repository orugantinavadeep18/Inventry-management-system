import express from 'express';
import {
  getOrders,
  getCustomerOrders,
  removeQuantity,
  completeOrder,
  createOrder,
  completeOrderById,
  getOrdersGroupedByCustomer
} from '../controllers/orderController.js';

const router = express.Router();

// ✅ 1. Admin: Fetch all orders
router.get('/', getOrders);

// ✅ 2. Admin: Orders grouped by customer (chart)
router.get('/grouped', getOrdersGroupedByCustomer);

// ✅ 3. Customer: Specific user orders
router.get('/customer/:id', getCustomerOrders);

// ✅ 4. Order actions
router.post('/', createOrder);
router.post('/removeQuantity', removeQuantity);
router.post('/complete', completeOrder);
router.put('/complete/:id', completeOrderById);

export default router;
