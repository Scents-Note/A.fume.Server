import S3FileDao from '@src/dao/S3FileDao';
import config from '../config/config';
import fs from 'fs';
import {
    DuplicatedEntryError,
    FailedToCreateError,
} from '@src/utils/errors/errors';
import storage from '../config/s3Config';

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
            const fileContent: Buffer = fs.readFileSync(fileData.path);
            const keyWithPrefix = `perfumes/${fileData.originalname}`;

            const params: {
                Bucket: string;
                Key: string;
                Body: Buffer;
            } = {
                Bucket: config.development.bucketName as string,
                Key: keyWithPrefix,
                Body: fileContent,
            };

            const result = await storage.upload(params).promise();
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
