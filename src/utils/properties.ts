import dotenv from 'dotenv';
dotenv.config();

const REQUIRED_ENV_LIST: string[] = [
    'AWS_S3_URL',
    'ENCRYPT_ALGORITHM',
    'ENCRYPTION_KEY',
    'JWT_SECRET',
    'MONGO_URI',
    'REDIS_DB_ID',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_URL',
];

const NULLABLE_ENV_MAP: { [key: string]: any } = {
    SERVER_NAME: process.env.name || 'unknown',
    NODE_ENV: 'development',
    CORS_ALLOW_LIST: '',
    SERVER_IP: 'localhost',
    PORT: '8080',
    LOG_PATH: 'logs',
    NODE_LOCATION: 'local',
    REDIS_PORT: '6379',
    REDIS_HOST: 'localhost',
    DISCORD_HOOK_FOR_SERVICE_MONITORING: undefined,
    DISCORD_HOOK_FOR_REPORT_REVIEW: undefined,
};

type Properties = {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
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
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_DB_ID: string;
    NODE_ENV: string;
    NODE_LOCATION: string;
    CORS_ALLOW_LIST: string;
    SERVER_IP: string;
    LOG_PATH: string;
    SERVER_NAME: string;
    DISCORD_HOOK_FOR_SERVICE_MONITORING: string;
    DISCORD_HOOK_FOR_REPORT_REVIEW: string;
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
