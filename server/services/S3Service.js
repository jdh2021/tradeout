const aws = require('aws-sdk');

/**
 * Service wrapper for AWS S3
 *
 * Use `S3.instance()` to grab a singleton instance
 * of the S3Service, configured with environment variables
 */
class S3Service {
    constructor({
        s3Bucket,
        s3Client,
    }) {
        this.s3Bucket = s3Bucket;
        this.s3Client = s3Client;
    }

    /**
     * Get the public URL of a file up on S3.
     *
     * If the file is not publicly available,
     * you will want to generate a presigned URL, instead.
     * See https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
     *
     * @param {Object} params
     * @param {Number} params.resourceId      For photos and resumes, this is a user ID.
     *                                        For contracts, this an application ID.
     * @param {S3Service.FileCategories} params.fileCategory
     * @param {String} params.fileName        Filename
     */
    toUrl({
        resourceId,
        fileCategory,
        fileName,
    }) {
        const s3Key = this._resourceToKey({ resourceId, fileCategory, fileName });
        return `https://${this.s3Bucket}.s3.amazonaws.com/${s3Key}`;
    }

    /**
     * Upload a file to S3, following our file naming convention
     * Follows S3 file naming conventions for users,
     * uploading to a location like:
     *
     *  users/resumes/000/000/023/myAwesomeResume.pdf
     *
     * @param {Object} params
     * @param {Number} params.resourceId      For photos and resumes, this is a user ID.
     *                                        For contracts, this an application ID.
     * @param {S3Service.FileCategories} params.fileCategory
     * @param {String} params.fileName        Filename, can be anything
     * @param {ArrayBuffer} params.data       File data
     * @param {string} params.acl             S3 object ACL. Defaults to "public-read"
     * @returns {Promise<{ Location, ETag, Bucket, Key }>}
     */
    async upload({
        resourceId,
        fileName,
        fileCategory,
        fileSize = S3Service.FileSize.Original,
        data,
        acl = 'bucket-owner-full-control',
    }) {
        const s3Key = this._resourceToKey({
            resourceId, fileName, fileCategory, fileSize,
        });

        // Upload to S3
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
        const s3Res = await this.s3Client.upload({
            Bucket: this.s3Bucket,
            Key: s3Key,
            Body: data,
            ACL: acl,
        }).promise();

        // { Location, ETag, Bucket, Key }
        return s3Res;
    }

    _resourceToKey({
        resourceId,
        fileCategory,
        fileSize = S3Service.FileSize.Original,
        fileName,
    }) {
        if (!Number.isInteger(resourceId)) {
            throw new Error(`Invalid resourceId for S3 file: ${resourceId}`);
        }

        if (!fileName) {
            throw new Error('Missing required fileName for S3 file');
        }

        if (!fileCategory) {
            throw new Error('Missing required fileCategory for S3 file');
        }

        // Key is formatted like (for userId=23)
        // users/resumes/000/000/023/original/myAwesomeResume.pdf
        return [
            fileCategory,
            fileSize,
            `${resourceId}_${fileName}`,
        ].join('/');
    }
}

S3Service.FileCategories = {
    Submissions: 'submissions/images',
    Contracts: 'contract/pdfs',
    Photos: 'contract/images',
};

S3Service.FileSize = {
    Original: 'original',
    Thumbnail: 'thumb',
    Medium: 'medium',
};

let instance;
/**
 * Returns a singleton instance of the S3Service
 * @returns {S3Service}
 */
S3Service.instance = () => {
    if (instance) {
        return instance;
    }

    // Grab env vars for AWS config
    const {
        AWS_REGION,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        S3_BUCKET_NAME,
    } = process.env;
    // Make sure we're configured to use the correct region
    aws.config.region = AWS_REGION;

    if (!S3_BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        throw new Error(
            'Missing required environment variables for AWS bucket: '
            + 'S3_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY',
        );
    }

    const s3Client = new aws.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION,
    });
    // Used for debugging
    // s3Client.listBuckets(function (err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else console.log('BUCKETS', data);           // successful response
    // });
    instance = new S3Service({
        s3Client,
        s3Bucket: S3_BUCKET_NAME,
    });

    return instance;
};

module.exports = S3Service;