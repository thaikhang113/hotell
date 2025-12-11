const db = require('../config/db');

const Room = {
    getAll: async () => {
        const res = await db.query(`
            SELECT r.*, rt.name as room_type_name 
            FROM Rooms r 
            JOIN Room_Types rt ON r.room_type_id = rt.room_type_id 
            ORDER BY r.room_number
        `);
        return res.rows;
    },

    getById: async (id, client) => {
        const dbClient = client || db; 
        const res = await dbClient.query('SELECT * FROM Rooms WHERE room_id = $1', [id]);
        return res.rows[0];
    },

    getAvailable: async (checkIn, checkOut) => {
        const res = await db.query(`
            SELECT r.*, rt.name as room_type_name, r.price_per_night as base_price
            FROM Rooms r
            JOIN Room_Types rt ON r.room_type_id = rt.room_type_id
            WHERE r.status = 'available'
            AND r.is_active = TRUE
            AND r.room_id NOT IN (
                SELECT br.room_id 
                FROM Booked_Rooms br
                JOIN Bookings b ON br.booking_id = b.booking_id
                WHERE b.status NOT IN ('cancelled', 'rejected')
                AND (
                    b.check_in < $2 AND b.check_out > $1
                )
            )
        `, [checkIn, checkOut]);
        return res.rows;
    },

    create: async (data) => {
        const { room_number, room_type_id, floor, price_per_night, description } = data;
        const res = await db.query(
            'INSERT INTO Rooms (room_number, room_type_id, floor, price_per_night, description, status, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [room_number, room_type_id, floor, price_per_night, description, 'available', true]
        );
        return res.rows[0];
    },

    update: async (id, data) => {
        const { room_number, room_type_id, floor, price_per_night, description, status, is_active } = data;
        const res = await db.query(
            `UPDATE Rooms 
             SET room_number = $1, room_type_id = $2, floor = $3, price_per_night = $4, description = $5, status = $6, is_active = $7
             WHERE room_id = $8 RETURNING *`,
            [room_number, room_type_id, floor, price_per_night, description, status, is_active, id]
        );
        return res.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM Rooms WHERE room_id = $1', [id]);
    },

    updateStatus: async (id, status, client) => {
        const dbClient = client || db; 
        const res = await dbClient.query('UPDATE Rooms SET status = $1 WHERE room_id = $2 RETURNING *', [status, id]);
        return res.rows[0];
    }
};

module.exports = Room;