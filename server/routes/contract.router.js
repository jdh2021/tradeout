const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET all contracts for logged in user
router.get('/', (req, res) => {
    console.log('in /api/contract GET. user id is:', req.user.id);
    console.log('is authenticated?', req.isAuthenticated());
    if (req.isAuthenticated()) {
        const queryText =   `SELECT "contract".* FROM "contract"
                            JOIN "user_contract" ON "user_contract"."contract_id"="contract"."id"
                            WHERE "user_contract"."user_id" = $1
                            ORDER BY "contract"."contract_created_at" DESC;`;
        pool.query(queryText, [req.user.id]).then(result => {
            if (result.rows.length > 0) {
                res.send(result.rows);
            } else {
                res.send([]); // return empty array if user has no contracts
            }
        }).catch(error => {
            console.log('Error in /api/contract GET:', error);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403); // forbidden (log in needed)
    }
});

module.exports = router;