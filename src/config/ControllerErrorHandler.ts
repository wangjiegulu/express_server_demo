import {Middleware, ExpressErrorMiddlewareInterface} from "routing-controllers";
import { ServerException, ServerError } from "../err/exception";

/**
 * Controller 异常处理
 */
@Middleware({ type: "after" })
export class ControllerErrorHandler implements ExpressErrorMiddlewareInterface {

    error(err: any, req: any, res: any, next: (err: any) => any) {
        console.log("[ControllerErrorHandler]err: ", err)
        if(err instanceof ServerException){
            let realError = err as ServerException
            return res.json({ code: realError.code, msg: realError.message})
        }
        return res.json(ServerError.SERVER_ERROR.toResp())
    }
}