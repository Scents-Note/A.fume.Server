import { getImageList } from '../lib/s3';
import properties from '../utils/properties';

const REGEX_IMAGE: RegExp = /\.jpg$|\.png$/i;

class S3FileDao {
    s3Url: string;
    constructor(s3Url?: string) {
        this.s3Url = s3Url ?? properties.AWS_S3_URL;
    }
    getS3ImageList(perfumeIdx: number): Promise<string[]> {
        return getImageList({
            Bucket: 'afume',
            Prefix: `perfume/${perfumeIdx}/`,
        }).then((it: string[]) => {
            return it
                .filter((it: string) => {
                    return it.search(REGEX_IMAGE) > 0;
                })
                .map((it: string) => {
                    return `${this.s3Url}/${it}`;
                });
        });
    }
}

export default S3FileDao;
