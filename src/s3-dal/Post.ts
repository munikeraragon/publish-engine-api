import {
    GetObjectCommand,
    CreateBucketCommand,
    PutObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './utils';

export class S3PostService {
    static async createUploadUrl(postKey: string) {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_POST_BUCKET,
            Key: postKey
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 100
        });
        return signedUrl;
    }

    static async createDownloadUrl(postKey: string) {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_POST_BUCKET,
            Key: postKey
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60 * 24
        });
        return signedUrl;
    }

    static async delete(postKey: string) {
        const result = await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.S3_POST_BUCKET,
                Key: postKey
            })
        );
        console.log(result);
        return result;
    }

    static async createBucket() {
        try {
            const articlesBucket = await s3Client.send(
                new CreateBucketCommand({ Bucket: process.env.S3_POST_BUCKET })
            );
            console.log('Success', articlesBucket.Location);
            return articlesBucket;
        } catch (err) {
            console.log('Error', err);
        }
    }
}
