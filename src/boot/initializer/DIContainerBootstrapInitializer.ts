import { ContainerExt } from '@ext/typedi.ext';
import { IBootstrapInitializer } from './bootstrap.init';
import rp = require('request-promise');

export class DIContainerBootstrapInitializer implements IBootstrapInitializer {
    initialize(app: any) {
        // RequestPromiseAPI 依赖
        ContainerExt.set("rp", rp)
    }

}