import { AuthStatus } from '@dal/db/entity/account';
import { Arg, Mutation, Query, Resolver, Authorized } from "type-graphql";
import AccountService from '@bll/AccountService';
import { User } from '@dal/db/entity/account';
import { GQLLoginReq } from '../vo/request';
import { GQLLoginResp } from '../vo/response';
import { Inject } from "typedi";

/**
 * https://typegraphql.ml/docs/resolvers.html
 */
@Resolver()
export class AccountResolver{

    // accountService: AccountService = Container.get(AccountService)

    @Inject()
    accountService: AccountService
    // constructor(
    //     private readonly accountService: AccountService,
    // ){}

    // @Autowired()
    // accountService: AccountService

    /**
     * 微信小程序登录
     */
    @Mutation(returns => GQLLoginResp)
    async loginByWechatMiniApp(@Arg("loginDetail", { nullable: true }) args: GQLLoginReq){
        console.log("args: ", args)
        let {user, loginInfo} = await this.accountService.loginByWechatMiniApp(args);
        let loginResp = new GQLLoginResp();
        loginResp.user = user;
        loginResp.loginInfo = loginInfo;
        return loginResp;
    }

    /**
     * 查询用户
     */
    @Authorized(AuthStatus.ADMIN)
    @Query(returns => User)
    async findUser(@Arg("userId", { nullable: false }) userId: number){
        return await this.accountService.findUserById(userId)
    }

}

