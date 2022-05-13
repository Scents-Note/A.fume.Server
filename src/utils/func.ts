function removeKeyJob(...keys: string[]): (obj: any) => any {
    return (obj: any): any => {
        const ret = Object.assign({}, obj);
        keys.forEach((it: any) => {
            delete ret[it];
        });
        return ret;
    };
}

function flatJob(...keys: string[]): (obj: any) => any {
    return (obj: any): any => {
        let ret = Object.assign({}, obj);
        keys.forEach((key: string) => {
            ret = Object.assign(ret, obj[key]);
            delete ret[key];
        });
        return ret;
    };
}

export { removeKeyJob, flatJob };
