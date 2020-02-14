import * as express from 'express';
let router = express.Router()
import { success, fail } from '@util/resUtil';
import { Container } from 'typedi';
import AccountService from '@bll/AccountService';

let accountService = Container.get(AccountService)

router.post('/login', async (req, res)=>{
    let result = await accountService.loginByWechatMiniApp(req.body)
    console.log("result: ", result)
    success(res, result)
})

module.exports = router