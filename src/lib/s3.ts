import AWS, { AWSError } from 'aws-sdk';
import { logger } from '@modules/winston';
import properties from '@src/utils/properties';

const REGEX_IMAGE: RegExp = /\.jpg$|\.png$/i;

interface S3Info {
    getConfig(): AWS.ConfigurationOptions;
    getUrl(): string;
}

const s3MainInfo: S3Info = {
    getConfig: (): AWS.ConfigurationOptions => {
        return {
            accessKeyId: properties.AWS_ACCESS_KEY_ID,
            secretAccessKey: properties.AWS_SECRET_ACCESS_KEY,
        };
    },
    getUrl: (): string => {
        return properties.AWS_S3_URL;
    },
};

const s3LegacyInfo: S3Info = {
    getConfig: (): AWS.ConfigurationOptions => {
        return {
            accessKeyId: properties.AWS_ACCESS_KEY_ID_LEGACY,
            secretAccessKey: properties.AWS_SECRET_ACCESS_KEY_LEGACY,
        };
    },
    getUrl: (): string => {
        return properties.AWS_S3_URL_LEGACY;
    },
};

class S3Adapter {
    readonly info: S3Info;
    readonly s3: AWS.S3;

    constructor(info: S3Info) {
        this.info = info;
        AWS.config.update(info.getConfig());
        this.s3 = new AWS.S3();
    }
    getImageList(params: AWS.S3.Types.ListObjectsV2Request): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.s3.listObjectsV2(
                params,
                (
                    err: AWSError,
                    data: AWS.S3.Types.ListObjectsV2Output
                ): void => {
                    if (err) {
                        logger.error(err.stack);
                        reject(err);
                        return;
                    }
                    const results: string[] =
                        data.Contents?.map((it: any) => it.Key) ?? [];
                    const imageUrls: string[] = results
                        .filter((it: string) => {
                            return it.search(REGEX_IMAGE) > 0;
                        })
                        .map((it: string) => {
                            return `${this.info.getUrl()}/${it}`;
                        });
                    resolve(imageUrls);
                }
            );
        });
    }

    static getMainS3Adapter(): S3Adapter {
        return new S3Adapter(s3MainInfo);
    }

    static getLegacyS3Adapter(): S3Adapter {
        return new S3Adapter(s3LegacyInfo);
    }
}

export { S3Adapter, S3Info };
