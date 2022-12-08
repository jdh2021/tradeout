// const dotenv = require('dotenv')
// const aws = require('aws-sdk');

// dotenv.config();

// const region = "use-east-3";
// const bucketName = "tradeout-bucket";
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// const s3 = new aws.S3({
//     region,
//     accessKeyId,
//     secretAccessKey,
//     signatureVersions: '4'
// })

// export async function generateUploadURL() {
//     const imageName = 'random image name';

//     const params = ({
//         Bucket: bucketName,
//         Key: imageName,
//         Expire: 60
//     })

//     const uploadURL = await s3.getSignedUrlPromise('putObject', params)
//     return uploadURL
// }