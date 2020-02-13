import { UserWechat, UserLogin } from './../../dal/db/entity/account';
import { _mockInstance } from './../mock.ext';
import { ServerException } from './../../exception/exception';
import AccountService from "../../bll/AccountService";
import { User } from "../../dal/db/entity/account";
import { EntityManager } from 'typeorm';
import { RequestPromiseAPI } from 'request-promise';
import moment = require('moment');

describe("findUserByIdOrNull", ()=>{
    let mockFindOne = jest.fn()
    let accountService = new AccountService()

    // mock EntityManager 实例和 findOne 方法
    let entityManager = _mockInstance<EntityManager>()
    entityManager.findOne = mockFindOne

    accountService.entityManager = entityManager

    beforeEach(()=>{
        mockFindOne.mockReset()
    })

    test("return normal value", async () => {
        let user = new User()
        mockFindOne.mockReturnValue(Promise.resolve(user))

        let result = await accountService.findUserByIdOrNull(1)
    
        expect(mockFindOne).toHaveBeenCalledTimes(1)
        expect(result).toBe(user)
    })

    test("return null value", async () => {
        mockFindOne.mockReturnValue(Promise.resolve(null))

        let result = await accountService.findUserByIdOrNull(1)
    
        expect(mockFindOne).toHaveBeenCalledTimes(1)
        expect(result).toBeNull()
    })

})

describe("findUserById", ()=>{
    let mockFindOne = jest.fn()
    let accountService = new AccountService()

    // mock EntityManager 实例和 findOne 方法
    let entityManager = _mockInstance<EntityManager>()
    entityManager.findOne = mockFindOne

    accountService.entityManager = entityManager
    accountService.appConfig = { wxApp: {
        wxAppId: "",
        wxAppSecert: "",
    } }

    beforeEach(()=>{
        mockFindOne.mockClear()
    })

    test("return normal value", async ()=>{
        let user = new User()

        mockFindOne.mockReturnValueOnce(Promise.resolve(user))

        let result = await accountService.findUserById(0)

        expect(mockFindOne).toHaveBeenCalledTimes(1)
        expect(result).toBe(user)
    })

    test("return null value and throw error", async ()=>{
        mockFindOne.mockReturnValueOnce(Promise.resolve(null))
        let err = null
        try{
            await accountService.findUserById(0)
        }catch(e){
            err = e
        }
        expect(err).not.toBeNull()
        expect(err).toBeInstanceOf(ServerException)
    })

})

describe("loginByWechatMiniApp", ()=>{

    const mockRpGet = jest.fn()
    const mockFindOne = jest.fn()
    const mockSave = jest.fn()

    const accountService = new AccountService()

    // mock entityManager
    const entityManager = _mockInstance<EntityManager>()
    entityManager.findOne = mockFindOne
    entityManager.save = mockSave
    accountService.entityManager = entityManager

    // mock rp
    const rp = _mockInstance<RequestPromiseAPI>()
    rp.get = mockRpGet
    accountService.rp = rp

    const loginDetail_validate = {
        code: '071XiLIJ0lTE0a2FgSIJ0MXyIJ0XiLIz',
        encryptedData: 'q5aHHUX7RNdFY8x2mmk0u0Uym8ibh/fF5TphVXVVKSd8jCuXJs1S5pnjn1W+yQpIoKalqZz2A9TVD/lu3gWSRiVRE7IxOz1nvUT9cNtCkl0r8Pu94N0OIaDPpgm2quM748hwUmYrRvnUqpE6a1BUy7eKkJ07+I0P2QywPq+VGrYOpvzbRqgs/se4EHnpNlAPugbPwEFyYdAp/44b9XWQlurOhVSU5sPa7G+GRPlPJWzP78UlI0vyZeVT63ei3M1/IB0+LSetQVhCN/8Z/WHB6bui2OlWdZtbqkGuB4pAhOoLyLLB7Qz4y87ug8HtYOvxHMrmHcE+cg1pDN7f+mysbYdNFWek7aoLctl1n9VBHufWpSK5t3VU9FrkuBmezfz1JAXI4OKH9a4fFglyg+IO0agdJMJi1HZVychCePBNXPqvE04h3V8Sv9zP82IxVc7f6pVZZJqABfW0UDvIgl7DlCsiPpbDeqXnDT6sdQsd4n0=',
        rawData: '{"nickName":"天天(●——●)","gender":1,"language":"en","city":"Huzhou","province":"Zhejiang","country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTInU87vvicIqzBY3CrHOE705y3xGbw0srOXrm3RMeOybx9t6m0cicb1t4cyvJzMUgPV38eASKghOesQ/132"}',
        signature: '97cbd08ef3a21a9fe383ebebd7ad2c0a5c097bf5',
        iv: 'YDNXEIKzQwk5bTAUUbIUGw=='
      }
    const sessionResult_validate = `{
        "session_key": "PivLETPydPtK89BTW2iiMA==",
        "openid": "oZyAL419EbStFByYVO5eDp_UkTzE"
      }`

    beforeEach(()=>{
        mockRpGet.mockClear()
        mockFindOne.mockClear()
        mockSave.mockClear()
    })

    test("login success (user not exist)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve(sessionResult_validate))
        mockFindOne.mockReturnValueOnce(Promise.resolve(null)) // find userWechat

        const user = new User()
        mockSave.mockReturnValueOnce(Promise.resolve(user)) // save user
        const userWechat = new UserWechat()
        mockSave.mockReturnValueOnce(Promise.resolve(userWechat)) // save userWechat

        mockFindOne.mockReturnValueOnce(Promise.resolve(null)) // find userLogin

        const userLogin = new UserLogin()
        userLogin.token = "tokentoken"
        mockSave.mockReturnValueOnce(Promise.resolve(userLogin)) // save userLogin

        let result = await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)

        expect(mockRpGet).toBeCalledTimes(1)
        expect(mockFindOne).toBeCalledTimes(2)
        expect(mockSave).toBeCalledTimes(3)
        expect(result.user).toEqual(user)
        expect(result.loginInfo).toEqual(userLogin)
    })

    test("login success (user exist, userLogin null)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(sessionResult_validate)
        const userWechat = new UserWechat()
        mockFindOne.mockReturnValueOnce(Promise.resolve(userWechat)) // find userWechat

        const user = new User()
        mockFindOne.mockReturnValueOnce(Promise.resolve(user)) // find user

        mockFindOne.mockReturnValueOnce(Promise.resolve(null)) // find userLogin

        const userLogin = new UserLogin()
        userLogin.token = "tokentoken"
        mockSave.mockReturnValueOnce(Promise.resolve(userLogin)) // save userLogin

        let result = await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)

        expect(mockRpGet).toBeCalledTimes(1)
        expect(mockFindOne).toBeCalledTimes(3)
        expect(mockSave).toBeCalledTimes(1)
        expect(result.user).toEqual(user)
        expect(result.loginInfo).toEqual(userLogin)
    })

    test("login success (user exist, userLogin is expired)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve(sessionResult_validate))
        const userWechat = new UserWechat()
        mockFindOne.mockReturnValueOnce((userWechat)) // find userWechat

        const user = new User()
        mockFindOne.mockReturnValueOnce((user)) // find user

        const userLogin = new UserLogin()
        let now = moment()
        userLogin.expiredAt = now.subtract(1, 'd').toDate() // 过期时间为昨天
        mockFindOne.mockReturnValueOnce((userLogin)) // find userLogin

        userLogin.token = "tokentoken"
        mockSave.mockReturnValueOnce(Promise.resolve(userLogin)) // save userLogin

        let result = await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)

        expect(mockRpGet).toBeCalledTimes(1)
        expect(mockFindOne).toBeCalledTimes(3)
        expect(mockSave).toBeCalledTimes(1)
        expect(result.user).toEqual(user)
        expect(result.loginInfo).toEqual(userLogin)
        expect(userLogin.expiredAt.getTime()).toBeGreaterThan(moment().millisecond())
    })

    test("login success (user exist, userLogin is not expired)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve(sessionResult_validate))
        const userWechat = new UserWechat()
        mockFindOne.mockReturnValueOnce(Promise.resolve(userWechat)) // find userWechat

        const user = new User()
        mockFindOne.mockReturnValueOnce(Promise.resolve(user)) // find user

        const userLogin = new UserLogin()
        let now = moment()
        userLogin.expiredAt = now.add(1, 'd').toDate() // 过期时间为明天
        mockFindOne.mockReturnValueOnce(Promise.resolve(userLogin)) // find userLogin

        userLogin.token = "tokentoken"
        mockSave.mockReturnValueOnce(Promise.resolve(userLogin)) // save userLogin

        let result = await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)

        expect(mockRpGet).toBeCalledTimes(1)
        expect(mockFindOne).toBeCalledTimes(3)
        expect(mockSave).toBeCalledTimes(1)
        expect(result.user).toEqual(user)
        expect(result.loginInfo).toEqual(userLogin)
        expect(userLogin.expiredAt.getTime()).toBeGreaterThan(moment().millisecond())
    })

    test("login fail (sessionResult error)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve("asdfasdf"))

        let err = null
        try{
            await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)
        }catch(e){
            err = e
        }
        expect(err).not.toBeNull()
        expect(err).toBeInstanceOf(Error)

        expect(mockFindOne).toBeCalledTimes(0)
        expect(mockSave).toBeCalledTimes(0)
    })

    test("login fail (sessionResult error, openid is null)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve(`{
            "session_key": "PivLETPydPtK89BTW2iiMA=="
        }`))

        let err = null
        try{
            await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)
        }catch(e){
            err = e
        }
        expect(err).not.toBeNull()
        expect(err).toBeInstanceOf(Error)

        expect(mockFindOne).toBeCalledTimes(0)
        expect(mockSave).toBeCalledTimes(0)
    })

    test("login fail (sessionResult error, session_key is null)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve(`{
            "openid": "oZyAL419EbStFByYVO5eDp_UkTzE"
        }`))

        let err = null
        try{
            await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)
        }catch(e){
            err = e
        }
        expect(err).not.toBeNull()
        expect(err).toBeInstanceOf(Error)

        expect(mockFindOne).toBeCalledTimes(0)
        expect(mockSave).toBeCalledTimes(0)
    })

    test("login fail (sessionResult error, openid & session_key is null)", async ()=>{
        // session result validate
        mockRpGet.mockReturnValue(Promise.resolve(`{}`))

        let err = null
        try{
            await accountService.loginByWechatMiniApp(loginDetail_validate, entityManager)
        }catch(e){
            err = e
        }
        expect(err).not.toBeNull()
        expect(err).toBeInstanceOf(Error)

        expect(mockFindOne).toBeCalledTimes(0)
        expect(mockSave).toBeCalledTimes(0)
    })

})