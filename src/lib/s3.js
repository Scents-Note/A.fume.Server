const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.getImageList = (params) => {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            }
            resolve(data.Contents.map((it) => it.Key));
        });
    });
};
