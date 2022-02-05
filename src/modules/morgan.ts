import morgan from 'morgan';

const combined: string =
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

const morganFormat: any =
    process.env.NODE_ENV !== 'production' ? 'dev' : combined;

function makeMorgan(writer: (str: string) => void) {
    return morgan(morganFormat, {
        stream: {
            write: writer,
        },
    });
}

export default makeMorgan;
