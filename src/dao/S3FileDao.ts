import properties from '@properties';

import { S3Adapter } from '@libs/s3';

import { logger } from '@modules/winston';

const LOG_TAG: string = '[S3File/DAO]';

class S3FileDao {
    s3Url: string;
    s3Adapter: S3Adapter;
    s3LegacyAdapter: S3Adapter;
    constructor(s3Url?: string) {
        this.s3Url = s3Url ?? properties.AWS_S3_URL;
        this.s3Adapter = S3Adapter.getMainS3Adapter();
        this.s3LegacyAdapter = S3Adapter.getLegacyS3Adapter();
    }
    getS3ImageList(perfumeIdx: number): Promise<string[]> {
        logger.debug(`${LOG_TAG} getS3ImageList(perfumeIdx = ${perfumeIdx})`);
        return this.s3Adapter.getImageList({
            Bucket: 'afume-release',
            Prefix: `perfumes/${perfumeIdx}_`,
        });
    }

    getS3ImageListFromLegacy(perfumeIdx: number): Promise<string[]> {
        logger.debug(
            `${LOG_TAG} getS3ImageListFromLegacy(perfumeIdx = ${perfumeIdx})`
        );
        return this.s3LegacyAdapter.getImageList({
            Bucket: 'afume',
            Prefix: `perfume/${perfumeIdx}/`,
        });
    }
}

export default S3FileDao;
