import { ServerError, ServerException } from "@err/exception"

/**
 * GraphQL 异常处理
 */
export const graphqlErrorHandler = (err)=>{
  console.log("[graphqlErrorHandler]err: ", (err.originalError || err))
  if(!err.originalError){
      return ServerError.SERVER_ERROR.toResp()
  }

  // 主动抛出的异常
  if(err.originalError instanceof ServerException){
    let realError = err.originalError as ServerException
    return { code: realError.code, msg: realError.message}
  }

  // 参数验证异常
  let validationErrors = err.originalError['validationErrors']
  if(validationErrors && validationErrors.length > 0){
    let constraint = validationErrors[0].constraints
    if(constraint){
      let constraintKeys = Object.keys(constraint)
      if(constraintKeys && constraintKeys.length > 0){
        return ServerError.ARGUMENT_ERROR.toResp(constraint[constraintKeys[0]])
      }
    }
    return ServerError.ARGUMENT_ERROR.toResp(`参数${validationErrors[0]['property']}不合法`)
  }
  return ServerError.SERVER_ERROR.toResp()
}