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

// POST new contract
router.post('/', async (req, res) => {
	console.log('in /api/contract POST. user id is:', req.user.id);
	console.log('is authenticated?', req.isAuthenticated());
    if (req.isAuthenticated()) {
    	const db = await pool.connect();
    	try {
    		await db.query('BEGIN');
    		// INSERT INTO "contract"
    		const addContractQuery = `INSERT INTO "contract" (
										    "contract_key",
										    "contract_status",
										    "contract_title",
										    "first_party_type",
										    "first_party_email",
										    "first_party_name",
										    "second_party_type",
										    "second_party_email",
										    "item_name",
										    "item_description",
										    "item_price",
										    "item_pickup_date",
										    "item_pickup_location",
										    "contract_deadline",
										    "contract_notes",
										    "first_party_signature"
										) 
										VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
										RETURNING "id";`
			const result = await db.query(addContractQuery, [
				req.body.contract_key,
				req.body.contract_status,				
                req.body.contract_title,
				req.body.first_party_type,
				req.user.email,
				req.user.legal_name,
				req.body.second_party_type,
				req.body.second_party_email,
				req.body.item_name,
				req.body.item_description,
				req.body.item_price,
				req.body.item_pickup_date,
				req.body.item_pickup_location,
				req.body.contract_deadline,
				req.body.contract_notes,
				req.body.first_party_signature,
			]);
			// the returned id of the new contract
			const newContractId = result.rows[0].id;
			console.log('newContractId: ', newContractId);
			// INSERT INTO "user_contract"
			const userContractQuery =   `INSERT INTO "user_contract" ("user_id", "contract_id")
									    VALUES ($1, $2);`
			await db.query(userContractQuery, [req.user.id, newContractId]);
			// INSERT INTO "photo"
			const addImageQuery =   `INSERT INTO "photo" ("contract_id", "item_image", "item_image_description")
									VALUES ($1, $2, $3);`
			await db.query(addImageQuery, [newContractId, req.body.item_image, req.body.item_image_description]);
			await db.query('COMMIT');
			res.sendStatus(201);
    	} catch (error) {
    		await db.query('ROLLBACK');
            console.log('Something went wrong posting the new contract.', error);
    	    res.sendStatus(500);
    	} finally {
            db.release();
        }
    } else {
    	res.sendStatus(403); // forbidden
    }
});

// UPDATE contract status
router.put('/', (req, res) => {
    console.log('in /api/contract UPDATE. Contract object to update is:', req.body);
    console.log('Contract status is:', req.body.contract_status);
    console.log('is authenticated?', req.isAuthenticated());
    if (req.isAuthenticated()) { // if contract status is accepted or declined and user is logged in, req.user.id is checked.
        console.log('User id is:', req.user.id);
        const query =   `UPDATE "contract"
						SET "contract_status" = $1, "contract_approval" = $2, "second_party_signature" = $3
						FROM "user_contract"
						WHERE "user_contract"."user_id" = $4 AND "user_contract"."contract_id"="contract"."id" AND "contract"."id" = $5;`;
        pool.query(query, [req.body.contract_status, req.body.contract_approval, req.body.second_party_signature, req.user.id, req.body.id]).then(result => {
            console.log('/contract UPDATE success');
            res.sendStatus(200); // OK
        }).catch(error => {
            console.log('Error in UPDATE contract by contract id:', error);
            res.sendStatus(500);
        })
    } else if (req.body.contract_status === 'declined') { // contract recipient not required to be user to decline contract, and req.user.id isn't checked
        const queryText =   `UPDATE "contract"
                            SET "contract_status" = $1, "contract_approval" = $2, "second_party_signature" = $3
                            WHERE "id" = $4;`;
        pool.query(queryText, [req.body.contract_status, req.body.contract_approval, req.body.second_party_signature, req.body.id]).then(result => {
            console.log('/contract UPDATE success');
            res.sendStatus(200); // OK
        }).catch(error => { 
            console.log('Error in UPDATE contract by contract id:', error);
            res.sendStatus(500);
        })
    } else { // if a user isn't logged in and contract status is anything except 'declined', update to contract status is forbidden
        res.sendStatus(403); // 403 forbidden (must log in) 
    };
});



module.exports = router;