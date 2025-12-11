const Invoice = require('../models/invoice');

const InvoiceController = {
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.getAll();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getInvoiceById: async (req, res) => {
        try {
            const invoice = await Invoice.getById(req.params.id);
            if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePaymentStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, method } = req.body;
            const updatedInvoice = await Invoice.updatePaymentStatus(id, status, method);
            res.json({ success: true, data: updatedInvoice });
        } catch (error) {
            console.error("Update Payment Error:", error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = InvoiceController;