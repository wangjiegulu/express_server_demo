import { Container } from 'typedi';
import { IBootstrapInitializer } from './bootstrap.init';
import { useContainer } from 'routing-controllers';

export class RoutingControllerBootstrapInitializer implements IBootstrapInitializer{
    initialize(app: any) {
        // 依赖注入对 controller 的支持
        useContainer(Container);
    }

}