class SimpleResponseDTO {
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}

class ResponseDTO<Type> extends SimpleResponseDTO {
    data: Type;
    constructor(message: string, data: Type) {
        super(message);
        this.data = data;
    }
}

export { ResponseDTO, SimpleResponseDTO };
