import { Client } from '@opensearch-project/opensearch';
import { RequestBody } from '@opensearch-project/opensearch/lib/Transport';

const account = process.env.OPENSEARCH_ACCOUNT;
const password = process.env.OPENSEARCH_PASSWORD;
const host = process.env.OPENSEARCH_HOST;
const openSearchNode = `https://${account}:${password}@${host}`;
export const client = new Client({ node: openSearchNode });

export const opensearch_index_name = `scentsnote-perfume-${
    process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
}`;

interface SearchRequestResult<T> {
    body: {
        hits: {
            total: { value: number };
            hits: Array<{ _source: T }>;
        };
    };
}

export async function requestPerfumeSearch<T>(
    body: RequestBody
): Promise<SearchRequestResult<T>> {
    if (process.env.NODE_ENV === 'test') {
        throw new Error('must be mocked');
    }
    return await client.search({ index: opensearch_index_name, body });
}
