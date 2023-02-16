type Dict = { [key: string]: any };
type Predicator = (obj: any) => boolean;

function traversalAllValues(predicate: Predicator) {
    function recursive(obj: Dict): boolean {
        let ret: boolean = true;
        for (const key in obj) {
            if (obj[key] instanceof Object) {
                ret = ret && recursive(obj[key]);
                continue;
            }
            ret = ret && predicate(obj);
        }
        return ret;
    }
    return (obj: Dict) => recursive(obj);
}

function checkAllValues(obj: Dict, predicate: Predicator) {
    return traversalAllValues(predicate)(obj);
}

export { checkAllValues };
