class SimpleResponseDTO {
    message: string;
    constructor(message: string) {
        this.message = message;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

class ResponseDTO<Type> extends SimpleResponseDTO {
    data: Type;
    constructor(message: string, data: Type) {
        super(message);
        this.data = data;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { ResponseDTO, SimpleResponseDTO };
