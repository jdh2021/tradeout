const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const path = require('path');
const S3Service = require('../services/S3Service');
const crypto = require('crypto');

// GET all contracts for logged in user
router.get('/', (req, res) => {
	// console.log('in /api/contract GET. user id is:', req.user.id);
	// console.log('is authenticated?', req.isAuthenticated());
	if (req.isAuthenticated()) {
		const queryText = `SELECT "contract".*, "photo"."item_image" 
							FROM "contract"
							JOIN "user_contract" 
							ON "user_contract"."contract_id"="contract"."id"
							JOIN "photo"
							ON "photo"."contract_id"="contract"."id"
							WHERE "user_contract"."user_id" = $1
							ORDER BY "contract_created_at" DESC;`
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
	// console.log('/:id GET route');
	// console.log('is authenticated?', req.isAuthenticated());
	// console.log('user', req.user);
	if (req.isAuthenticated()) {
		const query = `SELECT "contract".*, "photo"."item_image" FROM "contract"
						JOIN "user_contract" 
						ON "user_contract"."contract_id"="contract"."id"
						JOIN "photo"
						ON "photo"."contract_id"="contract"."id"
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
	// console.log('in /api/contract POST. user id is:', req.user.id);
	// console.log('is authenticated?', req.isAuthenticated());
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
			const userContractQuery = `INSERT INTO "user_contract" ("user_id", "contract_id")
									    VALUES ($1, $2);`
			await db.query(userContractQuery, [req.user.id, newContractId]);
			// INSERT INTO "photo"
			const addImageQuery = `INSERT INTO "photo" ("contract_id", "item_image", "item_image_description")
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
// UPDATE contract status
router.put('/', (req, res) => {
	// console.log('in /api/contract UPDATE. Contract object to update is:', req.body);
	// console.log('Contract status is:', req.body.contract_status);
	// console.log('is authenticated?', req.isAuthenticated());
	if (req.isAuthenticated()) { // if contract status is accepted or declined and user is logged in, req.user.id is checked.
		// console.log('User id is:', req.user.id);
		const query = `UPDATE "contract"
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
		const queryText = `UPDATE "contract"
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

/*******************************************
 * PDF GENERATION
 *******************************************/

//converts PDF binaryresult data to stream
const streamToBuffer = (stream) => {
	return new Promise((resolve, reject) => {
		const data = [];

		stream.on('end', () => {
			console.log('buffer end')
			resolve(Buffer.concat(data))
		})

		stream.on('finish', () => {
			console.log('buffer finish')
			resolve(Buffer.concat(data))
		})

		stream.on('close', () => {
			console.log('buffer close')
			resolve(Buffer.concat(data))
		})

		stream.on('error', (err) => {
			reject(err)
		})

		stream.on('data', (chunk) => {
			console.log(chunk);
			data.push(chunk);
		});

	})
}
//Fonts needed for PDF formatting
const fonts = {
	Roboto: {
		normal: path.join(__dirname, '../fonts/Roboto-Regular.ttf'),
		bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
		italics: path.join(__dirname, '../fonts/Roboto-Italic.ttf'),
		bolditalics: path.join(__dirname, '../fonts/Roboto-MediumItalic.ttf')
	}
};

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);

//fills pdf format with contract values
const generatePDF = async (userId, contractId) => {

	const query = `SELECT "contract".*, "photo"."item_image" FROM "contract"
					JOIN "user_contract" 
					ON "user_contract"."contract_id"="contract"."id"
					JOIN "photo"
					ON "photo"."contract_id"="contract"."id"
					WHERE "user_contract"."user_id" = $1
					AND "user_contract"."contract_id" = $2;` ;

	const results = await pool.query(query, [userId, contractId]) // user and contract id passed 
	// console.log(results.rows)
	const foundContract = results.rows[0];
	//contract values inserted into "content"

	const dd = {
		pageSize: 'LETTER',
		content:
			[
				//contract heading
				{ style: 'header', alignment: 'center', text: 'Bill of Sale' },

				// contract title
				{ style: 'contractTitle', alignment: 'center', text: 'Legal Contract for ' },
				{ style: 'contractTitle', alignment: 'center', text: `${foundContract.contract_title}`, decoration: 'underline' },

				// involved parties
				{ style: 'sectionHeading', text: 'Date of Bill & Involved Parties' },
				{
					style: 'contractBody', text: `THIS BILL OF SALE is executed on ${foundContract.item_pickup_date.toDateString()} by and between ${foundContract.first_party_name}
			(hereinafter referred to as the "${foundContract.first_party_type}") and the ${foundContract.second_party_name} (hereinafter referred to as the "${foundContract.second_party_type}").`
				},

				// contract terms
				{ style: 'sectionHeading', text: 'Terms' },
				{
					style: 'contractBody',
					text: 'The Seller hereby agrees to transfer to the Buyer all rights of the Seller in the following property'
				},

				{
					style: 'contractBody', text: `PROPERTY: ${foundContract.item_name},
										PROPERTY DETAILS: ${foundContract.item_description}`
				},

				{ style: 'contractBody', text: 'for and in consideration of a total purchase price of' }, { text: `$${foundContract.item_price}`, fontSize: 9, background: '#ffff66' },

				{
					style: 'contractBody', text: `an amount agreed upon by the Seller and the Buyer. The form of payment used will be cash and 
			sales tax is included in the purchase price of the above-mentioned property.

			The Seller hereby affirms that the above information about this property is accurate to the best of their knowledge, 
			and by their signature below certifies they are the lawful owner of the property with the ability to sell it as they 
			see fit.

			The sale and transfer of property is hereby made on an "AS IS" condition, without any express or implied warranties, with 
			no recourse to the Seller, provided that the Seller can issue proof that they have the title to the property without any 
			liens or encumbrances. The Buyer agrees to accept all property in its existing state.

			`},

				{ style: 'sectionHeading', text: 'Notes regarding the above property and/or the transaction:' },

				{ style: 'contractBody', text: `${foundContract.contract_notes},` },

				{ style: 'sectionHeading', text: 'Product Image' },
				{ style: 'contractBody', text: `AS IS" image of the property provided by the ${foundContract.first_party_type}` },

				{ style: 'pictureLink', text: 'DOWNLOAD PICTURE', link: `${foundContract.item_image}` },

				{ text: 'scan QR code' },
				{ qr: `${foundContract.item_image}`, fit: '100' },


				// transfer of goods
				{ style: 'sectionHeading', text: 'Transfer of goods' },
				{
					style: 'contractBody',
					text: `The above property will be transferred on: ${foundContract.item_pickup_date.toDateString()}.
					The Seller and Buyer will meet in ${foundContract.item_pickup_location} to conduct the transaction for the above property.`
				},

				//signatures
				{ style: 'sectionHeading', text: 'Witnesses' },
				{ style: 'contractBody', text: 'IN WITNESS THEREOF, the parties execute this Bill of Sale', alignment: 'left' },
				{
					style: 'contractSignatures',
					alignment: 'left',
					text: ` ${foundContract.first_party_type} Signature: ${foundContract.first_party_signature},
				${foundContract.second_party_type} Signature: ${foundContract.second_party_signature}
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
				margin: [1, 10, 1, 1],
			},

			contractBody: {
				fontSize: 9,

			},
			contractSignatures: {
				fontsize: 12,
				bold: true,
				margin: [1, 5, 1, 1],
			},

			sectionHeading: {
				fontSize: 10,
				bold: true,
				decoration: 'underline',
				margin: [1, 2, 1, 1],
			},

			pictureLink: {
				fontSize: 10,
				bold: true,
				color: 'blue',
				decoration: 'underline',
				margin: [1, 2, 1, 1],
			},

		},

		footer: {
			text: 'Contract created using TradeOut® ', alignment: 'center', fontSize: 9
		},
	}

	//generate pdf document
	// const binaryResult = await printer.createPdfKitDocument(dd, {});
	const binaryResult = await printer.createPdfKitDocument(dd, {});
	return binaryResult;
}

const sendPDFtoAWS = async (userId, fileName, data) => {
	try {
		const s3 = S3Service.instance();
		console.log('await s3.upload');
		await s3.uploadPDF({
			resourceId: Number(userId),
			fileName: fileName,
			fileCategory: S3Service.FileCategories.Contracts,
			data: data,
		});
		const url = s3.toUrl({
			resourceId: Number(userId),
			fileCategory: S3Service.FileCategories.Contracts,
			fileName: fileName
		})
		console.log('URL', url);
		return url;
	} catch (error) {
		console.log(error)
		return 'error';
	}
}
//Handles PDF conversion, creates a URL and stores in AWS S3.
router.put('/pdf', async (req, res) => {
	// console.log('in /api/contract/pdf  UPDATE PDF RECEIPT. Contract object to update is:', req.body);
	// console.log('Contract status is:', req.body.contract_status);
	// console.log('is authenticated?', req.isAuthenticated());
	if (req.isAuthenticated()) { // if contract status is accepted or declined and user is logged in, req.user.id is checked.
		try {
			console.log('/contract/pdf begin PDF generation');
			const binaryResult = await generatePDF(req.user.id, req.body.id);

			// Creates a PDF named 1_RANDOM_contract.pd
			const randomString = crypto.randomBytes(4).toString('hex');
			console.log('convert stream to buffer')
			binaryResult.end(); // end of the stream. The stream needs and end otherwise function stops here and won't send an error
			const buffer = await streamToBuffer(binaryResult);
			console.log('uploading to aws')
			// upload binaryResult to AWS
			//contractUrl is the pdf link stored in s3
			const contractUrl = await sendPDFtoAWS(req.body.id, `${randomString}_contract.pdf`, buffer);
			// console.log(contractUrl);
			// console.log('User id is:', req.user.id);
			// Update to include the contract url = contract receipt
			const query = `UPDATE "contract"
							SET  "contract_receipt" = $1
							FROM "user_contract"
							WHERE "user_contract"."user_id" = $2 AND "user_contract"."contract_id"="contract"."id" AND "contract"."id" = $3;`;
			await pool.query(query, [contractUrl, req.user.id, req.body.id,])

			res.sendStatus(200); // OK

		} catch (error) {
			console.log('Error in /PDF contract generation', error);
			res.sendStatus(500);
		}
	} else { // if a user isn't logged in and contract status is anything except 'declined', update to contract status is forbidden
		res.sendStatus(403); // 403 forbidden (must log in) 
	};
});

/*******************************************
 * END OF PDF GENERATION CODE
 *******************************************/




module.exports = router;