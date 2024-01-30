import S3FileDao from '@src/dao/S3FileDao';

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
}

export default ImageService;
