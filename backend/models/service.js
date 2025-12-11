const db = require('../config/db');

const Service = {
    getAll: async (client) => {
        const dbClient = client || db;
        const res = await dbClient.query('SELECT * FROM Services WHERE availability = TRUE');
        return res.rows;
    },

    addUsedService: async (data, client) => {
        const dbClient = client || db;
        const { booking_id, service_id, quantity, price, room_id } = data;
        const res = await dbClient.query(
            'INSERT INTO Used_Services (booking_id, service_id, quantity, service_price, service_date, room_id) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *',
            [booking_id, service_id, quantity, price, room_id || null]
        );
        return res.rows[0];
    },

    create: async (data) => {
        const { service_code, name, price, description, availability } = data;
        const res = await db.query(
            'INSERT INTO Services (service_code, name, price, description, availability) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [service_code, name, price, description, availability]
        );
        return res.rows[0];
    },

    update: async (id, data) => {
        const { name, price, description, availability } = data;
        const res = await db.query(
            'UPDATE Services SET name = $1, price = $2, description = $3, availability = $4 WHERE service_id = $5 RETURNING *',
            [name, price, description, availability, id]
        );
        return res.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM Services WHERE service_id = $1', [id]);
    },

    getUsedByBooking: async (bookingId, client) => {
        const dbClient = client || db;
        const res = await dbClient.query(`
            SELECT us.*, s.name, r.room_number 
            FROM Used_Services us
            JOIN Services s ON us.service_id = s.service_id
            LEFT JOIN Rooms r ON us.room_id = r.room_id
            WHERE us.booking_id = $1
        `, [bookingId]);
        return res.rows;
    }
};

module.exports = Service;