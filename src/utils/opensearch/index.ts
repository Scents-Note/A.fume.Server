import { Client } from '@opensearch-project/opensearch';

const account = process.env.OPENSEARCH_ACCOUNT;
const password = process.env.OPENSEARCH_PASSWORD;
const host = process.env.OPENSEARCH_HOST;
const openSearchNode = `https://${account}:${password}@${host}`;
export const client = new Client({ node: openSearchNode });

export const opensearch_index_name = `scentsnote-perfume-${
    process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
}`;
