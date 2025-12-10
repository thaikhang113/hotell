const express = require('express');
const router = express.Router();
// QUAN TRỌNG: Tên file phải khớp chính xác (invoiceController)
const invoiceController = require('../controllers/invoiceController');

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id/payment', invoiceController.updatePaymentStatus);

module.exports = router;