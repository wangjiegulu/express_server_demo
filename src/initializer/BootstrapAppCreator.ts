import { IBootstrapAppCreator } from './bootstrap.init';
import { createExpressServer } from 'routing-controllers';
import { ControllerErrorHandler } from '../config/ControllerErrorHandler';
import { authorizationChecker } from '../config/AuthorizationChecker';
import { currentUserChecker } from '../config/CurrentUserChecker';
import { PROJECT_ROOT_PATH } from '../app';

export class BootstrapAppCreator implements IBootstrapAppCreator{

    create() {
        // 使用 routing-controllers 创建 app
        return createExpressServer({
            controllers: [`${PROJECT_ROOT_PATH}/**/*Controller.{ts,js}`],
            middlewares: [ ControllerErrorHandler ], // 异常处理
            defaultErrorHandler: false,
            cors: true, // 允许跨域
            authorizationChecker: authorizationChecker,
            currentUserChecker: currentUserChecker // 注入当前 User 到 API
          });
    }

}