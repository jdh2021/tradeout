const express = require('express');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const S3Service = require('../services/S3Service');
// import { generateUploadURL} from '../modules/s3';
// const s3 = require('../modules/s3')
// require('dotenv').config();

const router = express.Router();

//POST route for session submission form 
router.post('/image', rejectUnauthenticated, async (req, res) => {
    try {
        const uploadProps = req.query;
        // Create the parameters for calling listObjects
        console.log(uploadProps);
        // Upload resume to S3
        const s3 = S3Service.instance();
        await s3.upload({
            resourceId: Number(req.user.id),
            fileName: uploadProps.name,
            fileCategory: S3Service.FileCategories.Photos,
            data: req.files.fileToUpload.data,
        });
        const url = s3.toUrl({
            resourceId: Number(req.user.id),
            fileName: uploadProps.name,
            fileCategory: S3Service.FileCategories.Photos,
        });
        console.log(url);
        res.send({ message: 'success', imagePath: url });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//POST route for session submission form 
router.post('/pdf', rejectUnauthenticated, async (req, res) => {
    try {
        // await query for contract
        let contractId;
        let contractName;
        let pdfBlob; // pdf make...
        // Upload resume to S3
        const s3 = S3Service.instance();
        await s3.upload({
            resourceId: Number(contractId),
            fileName: 'contract.pdf',
            fileCategory: S3Service.FileCategories.Contacts,
            data: pdfBlob,
        });
        const url = s3.toUrl({
            resourceId: Number(contractId),
            fileName: 'contract.pdf',
            fileCategory: S3Service.FileCategories.Contacts,
        });
        console.log(url);
        res.send({ message: 'success', imagePath: url });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;