import { AuthStatus, User } from './../dal/db/entity/account';
import { Controller, Get, Param, Authorized, CurrentUser } from 'routing-controllers';
// import { accountService } from '../bll';
import { ServerError } from '../exception/exception';
import { successJson } from '../util/resUtil';
import AccountService from '../bll/AccountService';
import { Inject, Container } from 'typedi';

/**
 * https://github.com/typestack/routing-controllers
 */
@Controller("/api/user")
@Authorized(AuthStatus.NORMAL)
export class UserController {

    @Inject()
    accountService: AccountService

    @Authorized(AuthStatus.NOT_LOGIN)
    @Get("/:userId")
    async findUser(@Param("userId") userId: number, @CurrentUser() currentUser: User){
        console.log("[Controller::findUser]currentUser: ", currentUser)
        let user = await this.accountService.findUserByIdOrNull(userId)
        if(!user){
            throw ServerError.USER_NOT_FIND_ERROR.exception()
        }
        return successJson({ user })
    }

    // @Get()
    // async getUser(@Req() request: Request){
    //     console.log("request: ", request['query'])
    // }
    // @Get()
    // async getUser(@QueryParam("userId") userId: number){
    //     console.log("userId: ", userId)
    //     return "hello"
    // }

}