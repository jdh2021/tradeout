const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/:id', (req, res) => {

    console.log('/:id GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    //if user is logged in run query

    if (req.isAuthenticated()) {
        //selects where contract matches id passed
        const query = `SELECT * FROM "contract" 
                    WHERE "user_id" = $1 
                    AND "id" = $2`;
        //passing array = req.params.id
        pool.query(query, [req.user.id, req.params.id]) // contract passed
            .then(result => {
                res.send(result.rows[0]);
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