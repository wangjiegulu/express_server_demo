import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import AccountService from '@bll/AccountService';

export let currentUserChecker = async (action: Action) => {
    //action中包含了request response next,整个上下文
    const token = action.request.headers["x-authorization-token"];
    let user = token ? await Container.get(AccountService).findUserByTokenOrNull(token) : null
    return user;
}