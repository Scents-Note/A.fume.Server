/**
 * @swagger
 * definitions:
 *   ReissueRequest:
 *     type: object
 *     properties:
 *       accessToken:
 *         type: string
 *       refreshToken:
 *         type: string
 * */
class ReissueRequest {
    readonly accessToken: string;
    readonly refreshToken: string;
    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    static createByJson(json: any): ReissueRequest {
        return new ReissueRequest(json.accessToken!!, json.refreshToken!!);
    }
}
export { ReissueRequest };
