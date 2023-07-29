import multer from 'multer';
type FileNameCallback = (error: Error | null, filename: string) => void;

export const multerConfig = {
    storage: multer.diskStorage({
        destination: 'perfumes/',
        filename: function (
            _req: any,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) {
            cb(null, file.originalname);
        },
    }),
};
