// TODO 불필요한 의존성
import { ListAndCountDTO } from '@dto/index';

type Convert = (obj: any) => any;
function updateRows(result: ListAndCountDTO<Object>, ...jobs: Convert[]) {
    const updatedRows = result.rows.map((it: any) => {
        return jobs.reduce((prev: any, cur: any) => {
            return cur(prev);
        }, it);
    });
    return new ListAndCountDTO<Object>(result.count, updatedRows);
}

function updateList(result: any[], ...jobs: Convert[]) {
    const list = result;
    return list.map((it: any) => {
        return jobs.reduce((prev: any, cur: any) => {
            return cur(prev);
        }, it);
    });
}

function removeKeyJob(...keys: string[]) {
    return (obj: any) => {
        const ret = Object.assign({}, obj);
        keys.forEach((it: any) => {
            delete ret[it];
        });
        return ret;
    };
}

function extractJob(key: string, ...fields: string[]) {
    return (obj: any) => {
        const ret = Object.assign({}, obj);
        fields.forEach((it) => {
            ret[it[1]] = obj[key][it[0]];
        });
        delete ret[key];
        return ret;
    };
}

function flatJob(...keys: string[]) {
    return (obj: any) => {
        let ret = Object.assign({}, obj);
        keys.forEach((key: string) => {
            ret = Object.assign(ret, obj[key]);
            delete ret[key];
        });
        return ret;
    };
}

export { updateRows, updateList, removeKeyJob, extractJob, flatJob };
