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
  try {
    // const username = req.body.username
    const email = req.body.email;
    const legalName = req.body.legalName;
    const password = encryptLib.encryptPassword(req.body.password);
    const contractKey = req.body.contractKey;
    // TODO: COMMIT AND ROLLBACK
    const queryText = `INSERT INTO "user" (email, legal_name, password)
      VALUES ($1, $2, $3) RETURNING id`;
    const createdUser = await pool.query(queryText, [email, legalName, password]);
    
    if (contractKey) {
      // Go fetch the contract with that key using SELECT
      const foundContract = await pool.query('SELECT * FROM "contract" WHERE "contract_key" = $1', [contractKey]);
      // If found, attach the new user to the contract with an INSERT INTO
      if (foundContract.rows > 0) {
        const contract = foundContract[0].id;
        const userId = createdUser.id;
        // INSERT INTO user_contract ...
      }
    }
    res.sendStatus(201);
  } catch (e) {
    console.log('User registration failed: ', err);
    res.sendStatus(500);
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
