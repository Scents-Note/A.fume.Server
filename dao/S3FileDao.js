'use strict';

const { getImageList } = require('../lib/s3.js');

module.exports.getS3ImageList = (perfumeIdx) => {
    return getImageList({
        Bucket: 'afume',
        Prefix: `perfume/${perfumeIdx}/`,
    }).then((it) => {
        if (!it.length) {
            console.log('Failed to read imageList from s3');
            return [];
        }
        return it
            .filter((it) => {
                return it.search(/\.jpg$|\.png$/i) > 0;
            })
            .map((it) => {
                return `${process.env.AWS_S3_URL}/${it}`;
            });
    });
};
