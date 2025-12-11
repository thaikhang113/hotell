const Service = require('../models/service');

const ServiceController = {
    getServiceList: async (req, res) => {
        try {
            const services = await Service.getAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    listServices: async (req, res) => {
        try {
            const services = await Service.getAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addService: async (req, res) => {
        try {
            const newService = await Service.create(req.body);
            res.status(201).json(newService);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateService: async (req, res) => {
        try {
            const updated = await Service.update(req.params.id, req.body);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteService: async (req, res) => {
        try {
            await Service.delete(req.params.id);
            res.json({ message: "Deleted" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ServiceController;