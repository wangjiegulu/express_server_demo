/**
 * App 启动器创建接口
 */
export interface IBootstrapAppCreator{
    create(): any
}

/**
 * 基础模块初始化接口
 */
export interface IBootstrapInitializer{
    initialize(app: any): any
}



