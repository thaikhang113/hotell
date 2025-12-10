const Invoice = require('../models/invoice');

const InvoiceController = {
    // API: Lấy tất cả hóa đơn
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.getAll();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // API: Lấy chi tiết hóa đơn
    getInvoiceById: async (req, res) => {
        try {
            const invoice = await Invoice.getById(req.params.id);
            if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // API: Cập nhật trạng thái thanh toán (FIX LỖI SERVER.JS)
    updatePaymentStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, method } = req.body; // status: 'paid', method: 'transfer'

            const updatedInvoice = await Invoice.updatePaymentStatus(id, status, method);
            res.json({ success: true, data: updatedInvoice });
        } catch (error) {
            console.error("Update Payment Error:", error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = InvoiceController;