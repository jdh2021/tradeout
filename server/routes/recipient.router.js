const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET contract by contract key. user not required to be logged in
router.get('/:id', (req, res) => {
    console.log('in /api/recipient GET contract by contract key');
    console.log('contract key is:', req.params.id);
    const queryText =   `SELECT * FROM "contract"
                        WHERE "contract"."contract_key" = $1;`;
    pool.query(queryText, [req.params.id]).then(result => {
        res.send(result.rows[0]);
    }).catch(error => {
        console.log('Error in /api/recipient GET contract by contract key:', error);
        res.sendStatus(500);
    });
});

module.exports = router;