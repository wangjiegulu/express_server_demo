// import { accountService } from './../bll/index';
import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import AccountService from '../bll/AccountService';
import { AuthStatus } from '../dal/db/entity/account';
import { ServerError } from '../exception/exception';

/**
 * 权限校验器
 */
export const authorizationChecker = async (action: Action, roles: AuthStatus[]) => {
    console.log("[authorizationChecker]action: ", action.request.url, "roles: ", roles);
    // 取最大权限
    // let needRole = roles && roles.length > 0 ? Math.max(...roles) : AuthorizationStatus.NORMAL

    // 取最后设置的权限（以后面设置的权限为主）
    let needRole = roles && roles.length > 0 ? roles[roles.length - 1] : AuthStatus.NORMAL

    // 如果所需权限在 NORMAL 以下，则直接通过
    if (!needRole.hasAuth(AuthStatus.NORMAL)) {
        return true
    }

    console.log("[authorizationChecker]needRole: ", needRole)

    let currentRole: AuthStatus
    const token = action.request.headers["x-authorization-token"];

    if (!token) {
        currentRole = AuthStatus.NOT_LOGIN
    } else {
        let user = await Container.get(AccountService).findUserByToken(token)
        currentRole = AuthStatus.toAuthStatus(user.status)
    }

    console.log("[authorizationChecker]currentRole: ", currentRole)

    // 校验权限
    if (!currentRole.hasAuth(needRole)) {
        throw ServerError.AUTHORIZATION_ERROR.exception()
    }
    return true
}