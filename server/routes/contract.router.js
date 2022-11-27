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

// GET specific contract by ID
router.get('/:id', (req, res) => {

    console.log('/:id GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    //if user is logged in run query

    if (req.isAuthenticated()) {
       
        const query =   `SELECT "contract".* FROM "contract"
                        JOIN "user_contract" 
                        ON "user_contract"."contract_id"="contract"."id"
                        WHERE "user_contract"."user_id" = $1 
                        AND "user_contract"."contract_id" = $2;`;
        
        pool.query(query, [req.user.id, req.params.id]) // user and contract id passed 
            .then(result => {
                res.send(result.rows[0]); // returns first item in the array. (contract is an object as is in reducer)
                console.log('success getting selected contract')
            })
            .catch(error => {
                console.log('ERROR getting specific contract from server', error)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(403); // 403 forbidden (must log in)
    }
});

module.exports = router;