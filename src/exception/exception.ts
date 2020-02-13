export const DEFAULT_ERROR_CODE = -3723152

export class ServerException extends Error{
    code: number
    message: string

    // static err(error: ServerError): ServerException {
    //     return new ServerException(error.message, error.code)
    // }

    constructor(message: string, code: number = DEFAULT_ERROR_CODE) {
        super(message)
        this.code = code
        this.message = message
    }
}

export class ServerError{
    static SERVER_ERROR = new ServerError(30000, "服务器错误")
    static LOGIN_ERROR = new ServerError(40001, "登录失败")
    static USER_NOT_FIND_ERROR = new ServerError(50001, "该用户不存在")
    static ARGUMENT_ERROR = new ServerError(60001, "请求参数有误")
    static AUTHORIZATION_ERROR = new ServerError(70001, "没有权限进行此操作")
    static TOKEN_ERROR = new ServerError(70002, "Token 无效或过期，请重新登录")

    code: number;
    message: string;

	private constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    exception(): ServerException{
        return new ServerException(this.message, this.code)
    }

    toResp(msg?: string){
        return { code: this.code, msg: msg || this.message }
    }
}