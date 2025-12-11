const Room = require('../models/room');

const RoomController = {
    getAllRooms: async (req, res) => {
        try {
            const rooms = await Room.getAll();
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchAvailableRooms: async (req, res) => {
        try {
            const { checkIn, checkOut } = req.query;
            if (!checkIn || !checkOut) {
                return res.status(400).json({ message: "Vui lòng cung cấp checkIn và checkOut" });
            }
            const rooms = await Room.getAvailable(checkIn, checkOut);
            res.json(rooms);
        } catch (error) {
            console.error("Search Error:", error);
            res.status(500).json({ message: error.message });
        }
    },

    getRoomById: async (req, res) => {
        try {
            const room = await Room.getById(req.params.id);
            if (!room) return res.status(404).json({ message: 'Room not found' });
            res.json(room);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createRoom: async (req, res) => {
        try {
            const newRoom = await Room.create(req.body);
            res.status(201).json(newRoom);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateRoom: async (req, res) => {
        try {
            const updatedRoom = await Room.update(req.params.id, req.body);
            res.json(updatedRoom);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteRoom: async (req, res) => {
        try {
            await Room.delete(req.params.id);
            res.json({ message: "Deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateRoomStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const updatedRoom = await Room.updateStatus(req.params.id, status);
            res.json(updatedRoom);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = RoomController;