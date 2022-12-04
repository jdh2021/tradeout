const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const sgMail = require('@sendgrid/mail')
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
    console.log('No sendgrid API set!');
}

router.post('/', async (req, res) => {
    const contractKey = req.body.contract_key;
    const secondPartyEmail = req.body.second_party_email;
    console.log(req.body.second_party_email, 'secondPartyEmail')
    console.log(req.body.contract_key)
    if (process.env.SENDGRID_EMAIL) {
        const msg = {
            to: secondPartyEmail, // Change to your recipient
            from: process.env.SENDGRID_EMAIL, // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: `${contractKey}`,
            html: `<a href="http://localhost:3000/#/recipient-view/${contractKey}">Click here</a> to view your contract.
            <strong>Here is your contract code</strong>
            <p>${contractKey}</p>
            `
            // html: `<strong>${contractKey}</strong>`,
        }
        sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
            res.send(200);
        })
        .catch((error) => {
            console.error(error)
        })
    } else {
        console.log(`Code http://localhost:3000/#/recipient-view/${contractKey}`);
    }

})



module.exports = router;