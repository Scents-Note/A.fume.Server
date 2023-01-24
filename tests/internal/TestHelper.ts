import {
    ExclusiveSuiteFunction,
    PendingSuiteFunction,
    SuiteFunction,
    TestFunction,
} from 'mocha';

const NO_OP = () => {};

type Executor<T> = (...args: any[]) => Promise<T>;
type Validator<T> = (result: T | null, err: any, parameter: any[]) => void;
type DescribeExtended =
    | SuiteFunction
    | PendingSuiteFunction
    | ExclusiveSuiteFunction;

class TestSingle<T> {
    readonly title: string;
    readonly executor: Executor<T>;
    readonly parameter: any[];
    readonly validator: Validator<T>;
    constructor(
        title: string,
        executor: Executor<T>,
        parameter: any[],
        validator: Validator<T> = NO_OP
    ) {
        this.title = title;
        this.executor = executor;
        this.parameter = parameter;
        this.validator = validator;
    }

    test(it: TestFunction) {
        it(`# case: ${this.title}`, () => {
            this.command();
        });
    }

    async command() {
        try {
            const result: T = await this.executor.apply(
                this.executor,
                this.parameter
            );
            this.validator(result, null, this.parameter);
        } catch (err: any) {
            this.validator(null, err, this.parameter);
        }
    }
}

class ParameterizedTest<T> {
    readonly title: string;
    readonly executor: Executor<T>;
    readonly validator: Validator<T>;
    readonly parameterList: any[][];
    constructor(
        title: string,
        executor: Executor<T>,
        validator: Validator<T> = NO_OP
    ) {
        this.title = title;
        this.executor = executor;
        this.validator = validator;
        this.parameterList = [];
    }

    addParameter(parameter: any[]): ParameterizedTest<T> {
        this.parameterList.push(parameter);
        return this;
    }

    addParameterAll(parameterList: any[][]): ParameterizedTest<T> {
        this.parameterList.push(...parameterList);
        return this;
    }

    async test(describe: DescribeExtended, it: TestFunction) {
        describe(`# case: ${this.title}`, () => {
            this.parameterList.forEach((parameter: any[], index: number) => {
                it(`# P${index + 1}`, async () => {
                    try {
                        const result: T = await this.executor.apply(
                            this.executor,
                            parameter
                        );
                        this.validator(result, null, parameter);
                    } catch (err: any) {
                        this.validator(null, err, parameter);
                    }
                });
            });
        });
    }
}

function composeValidator<T>(...validatorList: Validator<T>[]) {
    return (result: T | null, err: any, parameter: any[]): void => {
        validatorList.forEach((validator: Validator<T>) => {
            validator(result, err, parameter);
        });
    };
}

export { TestSingle, ParameterizedTest, composeValidator, Executor, Validator };
