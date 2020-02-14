import { ServerError } from '@err/exception';
import AccountService from '@bll/AccountService';
import { AuthStatus } from '@dal/db/entity/account';
import { Service, Inject } from 'typedi';

@Service()
export default class AuthService {

    @Inject()
    accountService: AccountService

    async checkAuth(token: string, roles: AuthStatus[]) {
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

        if (!token) {
            currentRole = AuthStatus.NOT_LOGIN
        } else {
            let user = await this.accountService.findUserByToken(token)
            currentRole = AuthStatus.toAuthStatus(user.status)
        }

        console.log("[authorizationChecker]currentRole: ", currentRole)

        // 校验权限
        if (!currentRole.hasAuth(needRole)) {
            throw ServerError.AUTHORIZATION_ERROR.exception()
        }
        return true
    }
}