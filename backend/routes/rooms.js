const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/search', roomController.searchAvailableRooms);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.put('/:id/status', roomController.updateRoomStatus);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;