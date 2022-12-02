const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', async (req, res, next) => {
  console.log('in /api/user POST. Contract key (if non-empty string) is:', req.body.contractKey);
  // const username = req.body.username
  const email = req.body.email;
  const legalName = req.body.legalName;
  const password = encryptLib.encryptPassword(req.body.password);
  const contractKey = req.body.contractKey;
  const client = await pool.connect();

  // if contractKey is empty string, inserts user without checking for contract to link by contract key 
  if (contractKey === '') {
    const queryText = `INSERT INTO "user" (email, legal_name, password)
    VALUES ($1, $2, $3) RETURNING id`;
    pool
      .query(queryText, [email, legalName, password])
      .then(() => res.sendStatus(201))
      .catch((err) => {
        console.log('User registration failed: ', err);
        res.sendStatus(500);
      });
  } else {
    try {
      await client.query('BEGIN');
      // select from "contract" table by contract key, return contract id
      const selectContract = `SELECT * FROM "contract"
                              WHERE "contract"."contract_key" = $1;`;
      const contract = await pool.query(selectContract, [contractKey])
      const contractId = contract.rows[0].id;
      console.log('contractId is:', contractId);
      // insert into "user" table to add user, return user id
      const insertUser = `INSERT INTO "user" (email, legal_name, password)
                          VALUES ($1, $2, $3) RETURNING "id";`;
      const result = await pool.query(insertUser, [email, legalName, password]);
      const userId = result.rows[0].id;
      console.log('userId is:', result.rows[0].id);
      // insert into "user_contract" table with returned values of user id and contract id
      await pool.query(`INSERT INTO "user_contract" ("user_id", "contract_id")
                        VALUES($1, $2);`, [userId, contractId]);
      await client.query('COMMIT'); // commit if queries succeeded
      res.sendStatus(201); 
    } catch (error) {
      console.log('User registration failed: ', error);
      await client.query('ROLLBACK');
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
