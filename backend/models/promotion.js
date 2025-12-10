const db = require('../config/db');

const Promotion = {
    findByCode: async (code, client) => {
        const dbClient = client || db; // FIX: Nếu client null thì dùng db
        const res = await dbClient.query(
            'SELECT * FROM Promotions WHERE promotion_code = $1 AND is_active = TRUE AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE',
            [code]
        );
        return res.rows[0];
    },

    incrementUsage: async (id, client) => {
        const dbClient = client || db; // FIX: Nếu client null thì dùng db
        await dbClient.query('UPDATE Promotions SET used_count = used_count + 1 WHERE promotion_id = $1', [id]);
    }
};

module.exports = Promotion;