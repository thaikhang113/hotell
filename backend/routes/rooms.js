const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// QUAN TRỌNG: Route tìm kiếm phải đặt trước route lấy ID
router.get('/search', roomController.searchAvailableRooms);

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id/status', roomController.updateRoomStatus);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;