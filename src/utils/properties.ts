const REQUIRED_ENV_LIST: string[] = [
    'AWS_S3_URL',
    'ENCRYPT_ALGORITHM',
    'ENCRYPTION_KEY',
    'JWT_SECRET',
    'MONGO_URI',
];

const NULLABLE_ENV_MAP: { [key: string]: any } = {
    NODE_ENV: 'development',
    CORS_ALLOW_LIST: '',
    SERVER_IP: 'localhost',
    PORT: '8080',
};

type Properties = {
    AWS_S3_URL: string;
    ENCRYPT_ALGORITHM: string;
    ENCRYPTION_KEY: string;
    JWT_SECRET: string;
    MONGO_URI: string;
    PORT: string;
    MYSQL_DEV_USERNAME: string;
    MYSQL_DEV_PASSWORD: string;
    MYSQL_DEV_DATABASE: string;
    MYSQL_DEV_HOST: string;
    MYSQL_DEV_PORT: string;
    MYSQL_DEV_DIALECT: string;
    MYSQL_TST_USERNAME: string;
    MYSQL_TST_PASSWORD: string;
    MYSQL_TST_DATABASE: string;
    MYSQL_TST_HOST: string;
    MYSQL_TST_PORT: string;
    MYSQL_TST_DIALECT: string;
    MYSQL_PRD_USERNAME: string;
    MYSQL_PRD_PASSWORD: string;
    MYSQL_PRD_DATABASE: string;
    MYSQL_PRD_HOST: string;
    MYSQL_PRD_PORT: string;
    MYSQL_PRD_DIALECT: string;
    NODE_ENV: string;
    CORS_ALLOW_LIST: string;
    SERVER_IP: string;
};
const properties: { [key: string]: any } = {};

for (const key of REQUIRED_ENV_LIST) {
    properties[key] =
        process.env[key] ?? throwExpression(canNotFoundProperty(key));
}
for (const key in NULLABLE_ENV_MAP) {
    const defaultValue: any = NULLABLE_ENV_MAP[key];
    properties[key] = process.env[key] ?? defaultValue;
}

function validCheck(properties: any) {
    const EnvRegexWhitelist: RegExp = /[test]|[development]|[production]/;
    if (!properties.NODE_ENV.match(EnvRegexWhitelist)) {
        throwExpression(
            'UnSupport test, development, production. current ENV is ' +
                properties.NODE_ENV
        );
    }
}
validCheck(properties);

function throwExpression(errorMessage: string): never {
    throw new Error(errorMessage);
}

function canNotFoundProperty(env_name: string): string {
    return "Can't not found ENV Property [process.env." + env_name + ']';
}

export default properties as Properties;
