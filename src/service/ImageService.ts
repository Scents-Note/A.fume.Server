import S3FileDao from '@src/dao/S3FileDao';
import config from '../config/config';
import fs from 'fs';
import AWS from 'aws-sdk';
import {
    DuplicatedEntryError,
    FailedToCreateError,
} from '@src/utils/errors/errors';

class ImageService {
    s3FileDao: S3FileDao;

    constructor(s3FileDao?: S3FileDao) {
        this.s3FileDao = s3FileDao ?? new S3FileDao();
    }

    async getImageList(
        perfumeIdx: number,
        defaultImage: string
    ): Promise<string[]> {
        const imageFromS3: string[] = await this.s3FileDao
            .getS3ImageList(perfumeIdx)
            .catch((_: any) => []);

        if (imageFromS3.length > 0) {
            return imageFromS3;
        }

        return [defaultImage];
    }

    static async uploadImagefileToS3(
        fileData: Express.Multer.File
    ): Promise<string> {
        try {
            console.log('Inside the Service');
            const fileContent: Buffer = fs.readFileSync(fileData.path);

            const storage: AWS.S3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: 'ap-northeast-2',
            });
            console.log('Inside the Service2');

            const params: {
                Bucket: string;
                Key: string;
                Body: Buffer;
            } = {
                Bucket: config.development.bucketName as string,
                Key: fileData.originalname,
                Body: fileContent,
            };
            console.log('Inside the Service3');

            const result = await storage.upload(params).promise();
            console.log(result.Location);
            return result.Location;
        } catch (err: Error | any) {
            if (err.parent?.errno === 1062) {
                throw new DuplicatedEntryError();
            }
            throw new FailedToCreateError();
        }
    }
}
export default ImageService;
