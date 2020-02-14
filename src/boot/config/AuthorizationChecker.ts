import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { AuthStatus } from '@dal/db/entity/account';
import AuthService from '@bll/AuthService';

/**
 * 权限校验器
 */
export const authorizationChecker = async (action: Action, roles: AuthStatus[]) => {
    console.log("[authorizationChecker]action: ", action.request.url, "roles: ", roles);
    let token = action.request.headers["x-authorization-token"];
    return await Container.get(AuthService).checkAuth(token, roles)
}