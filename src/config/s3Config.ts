import AWS from 'aws-sdk';
import config from './config';

const storage: AWS.S3 = new AWS.S3({
    accessKeyId: config.development.s3AccessKey,
    secretAccessKey: config.development.s3SecretKey,
    region: 'ap-northeast-2',
});

export default storage;
