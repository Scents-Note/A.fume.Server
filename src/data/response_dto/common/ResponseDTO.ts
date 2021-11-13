class ResponseDTO<Type> {
    message: string;
    data?: Type;
    constructor(message: string, data?: Type) {
        this.message = message;
        this.data = data;
    }
}

export default ResponseDTO;
