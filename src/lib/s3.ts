import AWS, { AWSError } from 'aws-sdk';
const s3 = new AWS.S3();

function getImageList(
    params: AWS.S3.Types.ListObjectsV2Request
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(
            params,
            (err: AWSError, data: AWS.S3.Types.ListObjectsV2Output): void => {
                if (err) {
                    console.log(err, err.stack);
                    reject(err);
                }
                resolve(data.Contents?.map((it: any) => it.Key) ?? []);
            }
        );
    });
}

export { getImageList };
