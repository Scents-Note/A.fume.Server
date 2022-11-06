const enum OpCode {
    NONE = 0,
    NEED_LOGIN = 101,
    LOGOUT = 102,
}

class SimpleResponseDTO {
    readonly message: string;
    readonly opcode: OpCode;
    constructor(message: string, opcode: OpCode = OpCode.NONE) {
        this.message = message;
        this.opcode = opcode;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

class ResponseDTO<Type> extends SimpleResponseDTO {
    readonly data: Type;
    constructor(message: string, data: Type, opcode: OpCode = OpCode.NONE) {
        super(message, opcode);
        this.data = data;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { ResponseDTO, SimpleResponseDTO, OpCode };
