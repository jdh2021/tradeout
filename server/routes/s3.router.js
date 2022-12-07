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

        // Upload resume to S3
        const s3 = S3Service.instance();
        await s3.upload({
            resourceId: Number(req.user.id),
            fileName: uploadProps.name,
            fileCategory: S3Service.FileCategories.Submissions,
            data: req.files.fileToUpload.data,
        });
        const url = s3.toUrl({
            resourceId: Number(req.user.id),
            fileName: uploadProps.name,
            fileCategory: S3Service.FileCategories.Submissions,
        });
        res.send({ message: 'success', imagePath: url });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;