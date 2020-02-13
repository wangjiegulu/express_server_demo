import * as moment from 'moment';
import { RequestPromiseAPI } from 'request-promise';
import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { Platform, User, UserLogin, UserWechat, WechatType } from '../dal/db/entity/account';
import { ServerError } from '../exception/exception';
import { InjectConfig, LazyInject } from '../ext/typedi.ext';
import { XTransaction, XTransactionManager } from '../ext/typeorm.ext';
import { generateNumberId, generateToken } from '../util/textUtil';
import { decryptData } from '../util/wxUtil';

@Service()
export default class AccountService {

    @LazyInject()
    entityManager: EntityManager

    @LazyInject("rp")
    rp: RequestPromiseAPI

    @InjectConfig()
    appConfig: any

    /**
     * 微信小程序登录
     * @param loginDetail 微信小程序授权信息
     */
    @XTransaction()
    async loginByWechatMiniApp(loginDetail: any, @XTransactionManager() manager?: EntityManager) {
        let { code } = loginDetail
        let { wxApp } = this.appConfig
        // console.log("appConfig: ", appConfig)
        let jscode2sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxApp.appId}&secret=${wxApp.appSecert}&js_code=${code}&grant_type=authorization_code`

        // throw ServerError.LOGIN_ERROR.exception()

        let sessionResult = JSON.parse(await this.rp.get(jscode2sessionUrl))
        console.log("sessionResult: ", sessionResult)
        if (!sessionResult || !sessionResult.session_key || !sessionResult.openid) {
            throw ServerError.LOGIN_ERROR.exception()
        }

        let resultUser: User;

        let userWechat = await manager.findOne(UserWechat, { openId: sessionResult.openid })
        // 微信用户存在，则直接返回
        if (userWechat) {
            resultUser = await manager.findOne(User, { id: userWechat.userId })
            console.log("[用户已经存在] resultUser: ", resultUser)
        } else { // 微信用户不存在，则解析并保存
            console.log("[用户不存在]")
            let { encryptedData, iv } = loginDetail
            let decryptedText = decryptData(sessionResult.session_key, iv, encryptedData)
            let decryptedJson = JSON.parse(decryptedText)
            console.log("decryptedJson: ", decryptedJson)

            // user
            let user = new User()
            user.username = generateNumberId();
            user.nickname = decryptedJson.nickName;
            user.avatar = decryptedJson.avatarUrl;
            user.gender = decryptedJson.gender;
            user.province = decryptedJson.province;
            user.country = decryptedJson.country;
            user.city = decryptedJson.city;
            user.language = decryptedJson.language;

            console.log("user: ", user)
            resultUser = await manager.save(User, user);

            // user wechat
            let userWechat = new UserWechat()
            userWechat.userId = resultUser.id;
            userWechat.appId = wxApp.appId;
            userWechat.wechatType = WechatType.MINI_APP;
            userWechat.openId = decryptedJson.openId;
            userWechat.unionId = decryptedJson.unionId || null;
            userWechat.detail = decryptedText;

            await manager.save(UserWechat, userWechat);
        }

        // user login
        let userLogin = await manager.findOne(UserLogin, { userId: resultUser.id, platform: Platform.MINI_APP })
        if (!userLogin) {
            userLogin = new UserLogin()
            userLogin.userId = resultUser.id;
            userLogin.platform = Platform.MINI_APP;
            userLogin.sessionKey = sessionResult.session_key;
        }
        userLogin.token = generateToken()
        let newExpiredAt = moment().add(1, 'M').toDate()
        userLogin.expiredAt = newExpiredAt
        let resultUserLogin = await manager.save(userLogin)

        console.log("resultUser: ", resultUser)
        console.log("resultUserLogin: ", resultUserLogin)

        return {
            user: resultUser,
            loginInfo: resultUserLogin
        }
    }

    async findUserById(userId: number) {
        let user = await this.findUserByIdOrNull(userId)
        if (!user) {
            throw ServerError.USER_NOT_FIND_ERROR.exception()
        }
        return user
    }

    async findUserByIdOrNull(userId: number) {
        return await this.entityManager.findOne(User, { id: userId })
    }

    async findUserByToken(token: string) {
        let userLogin = await this.entityManager.findOne(UserLogin, { token: token })
        // 如果 userLogin 为空或者 token 过期
        if (!userLogin || userLogin.isExpired()) {
            throw ServerError.TOKEN_ERROR.exception()
        }
        let user = await this.entityManager.findOne(User, { id: userLogin.userId })
        if (!user) {
            throw ServerError.USER_NOT_FIND_ERROR.exception()
        }
        return user
    }

    async findUserByTokenOrNull(token: string) {
        let userLogin = await this.entityManager.findOne(UserLogin, { token: token })
        return userLogin && !userLogin.isExpired() ? // 存在并且没有过期
            await this.entityManager.findOne(User, { id: userLogin.userId }) : null
    }

}

