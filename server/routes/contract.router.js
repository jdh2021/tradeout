const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const path = require('path');

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
										    "first_party_signature", 
                                            "created_by_user_id"
										) 
										VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
                req.user.id
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

//PDF creation
const fonts = {
	Roboto: {
		normal: path.join(__dirname, '../fonts/Roboto-Regular.ttf'),
		bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
		italics: path.join(__dirname,  '../fonts/Roboto-Italic.ttf'),
		bolditalics: path.join(__dirname, '../fonts/Roboto-MediumItalic.ttf')
	}
};
  
  const PdfPrinter = require('pdfmake');
const { style } = require('@mui/system');
const { lightBlue, blueGrey, blue, red } = require('@mui/material/colors');
  const printer = new PdfPrinter(fonts);

//PDF Generation
//move this code into 'put' that updates the status to accepedted
  router.get('/make/pdf/:id', async (req, res) => {
	try {

		const query =   `SELECT "contract".* FROM "contract"
						JOIN "user_contract" 
						ON "user_contract"."contract_id"="contract"."id"
						WHERE "user_contract"."user_id" = $1 
						AND "user_contract"."contract_id" = $2;`;

		const results = await pool.query(query, [req.user.id, req.params.id]) // user and contract id passed 
			console.log(results.rows)
		const foundContract = results.rows[0];			
		//contract values inserted into "content"
		
		const d = new Date()
		const year = d.getFullYear() 
		const date = d.getDate() 
		const dd = {
			pageSize:'LETTER',
			content: 
			[
			//contract heading
				{ style: 'header', alignment: 'center', text: 'Bill of Sale'  }, 

			// contract title
				{style: 'contractTitle', alignment: 'center', text: 'Legal Contract for '},
				{style: 'contractTitle', alignment: 'center', text: `${foundContract.contract_title}`, decoration: 'underline' },
				 
			// involved parties
				{style: 'sectionHeading', text: 'Date of Bill Involved Parties'},
				{style: 'contractBody', text : `THIS BILL OF SALE is executed on ${foundContract.item_pickup_date} by and between ${foundContract.first_party_name}
				(hereinafter referred to as the "${foundContract.first_party_type}") and the ${foundContract.second_party_name} (hereinafter referred to as the "${foundContract.second_party_type}").`
				},
				
			// contract terms
				{style: 'sectionHeading', text: 'Terms'},
				{style: 'contractBody', 
				 text: `The Seller hereby agrees to transfer to the Buyer all rights of the Seller in the following property
						${foundContract.item_name}: ${foundContract.item_description}
				
						For and in consideration of a total purchase price of`},
						
						{text: `$${foundContract.item_price}`, fontSize: 12, background: '#ffff66'},

						{style:'contractBody', text:`an amount agreed upon by the Seller and the Buyer. The form of payment used will be cash and sales tax is included in the purchase price of the above-mentioned property.
					
						The Seller hereby affirms that the above information about this property is accurate to the best of their knowledge, 
						and by their signature below certifies they are the lawful owner of the property with the ability to sell it as they 
						see fit.

						The sale and transfer of property is hereby made on an "AS IS" condition, without any express or implied warranties, with 
						no recourse to the Seller, provided that the Seller can issue proof that they have the title to the property without any 
						liens or encumbrances. The Buyer agrees to accept all property in its existing state.

						`},
					
						{style: 'sectionHeading', text: 'Notes regarding the above property and/or the transaction:'},
						
						{style: 'contractBody', text: `${foundContract.contract_notes},`},

						{style: 'sectionHeading', text: 'Product Image'},
						{style: 'contractBody', text:`AS IS" image of the property provided by the ${foundContract.first_party_type}:
					
						*IMAGE HERE* `},
						
					// transfer of goods
						{style: 'sectionHeading', text: 'Transfer of goods'},
						{style: 'contractBody', text: `The above property will be transferred on: ${foundContract.item_pickup_date},
						The Seller and Buyer will meet in ${foundContract.item_pickup_location} to conduct the transaction for the above property.`},
						 
					//signatures
						{style: 'sectionHeading', text: 'Witnesses'},
						{style: 'contractBody', text: 'IN WITNESS THEREOF, the parties execute this Bill of Sale', alignment:'left'},
						{style: 'contractSignatures', 
							alignment: 'left', 
							text: ` ${foundContract.first_party_type} Signature: ${foundContract.first_party_signature},
							${foundContract.second_party_type} Signature: ${foundContract.second_party_signature},
						`},
						
			],

			styles: {
				header: {
				  fontSize: 18,
				  bold: true
				},
				contractTitle: {
					fontSize: 12,
					bold: true,
					margin: [1,10,1,1],
				},
				
				contractBody: {
					fontSize: 9,
					margin:[1,10,1,1],
					
				},
				contractSignatures: {
					fontsize: 12,
					bold: true,
					margin:[1,5,1,1],
				},
				sectionHeading:{
					fontSize:10,
					bold: true,
					decoration: 'underline',
					margin:[1,5,1,1],
				}
				

			},
			
			footer: {
				  text: 'Contract created using TradeOut® ', alignment: 'center', fontSize: 9 },
		}

		//generate pdf document
		const binaryResult = await printer.createPdfKitDocument(dd, {});
		// send document back to client as file download
		res.setHeader('Content-Type', 'application/pdf');
		//change file name=contract name.pdf template literal with contract name
		res.setHeader('Content-Disposition', 'attachment; filename=product.pdf');
			binaryResult.pipe(res); // download to respsonse stream
			binaryResult.end(); // end of the stream
	} catch(err){
		
		res.send('<h2>There was an error displaying the PDF document.</h2>Error message: ' + err.message);
	}

});



module.exports = router;