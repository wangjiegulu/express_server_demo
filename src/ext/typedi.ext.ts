import { Inject } from 'typedi';
import { isTestEnv } from '../util/appUtil';
export class ContainerExt{
    static valueMapper = {}
    static callbackMapper = {}

    private constructor(){}

    static registerLazyHandler(nameOrType: any, callback: (value: any)=>void){
        let callbacks = this.callbackMapper[nameOrType]
        if(!callbacks){
            callbacks = []
            this.callbackMapper[nameOrType] = callbacks
        }
        callbacks.push(callback)
    }

    static set(nameOrType: any, value: any){
        this.valueMapper[nameOrType] = value
        let callbacks: ((value: any)=>void)[] = this.callbackMapper[nameOrType]
        if(callbacks){
            delete this.callbackMapper[nameOrType]
            callbacks.forEach(cb=>cb(value))
        }else{
            console.warn(`[WARN][ContainerExt]set(), nameOrType[${nameOrType}] callback is not found!`)
        }
    }

    static get(nameOrType: any){
        return this.valueMapper[nameOrType]
    }

    static finally(){
        let keys = Object.keys(this.callbackMapper)
        if(keys && keys.length > 0){
            throw Error(`Invalidate @LazyInject: \n\n-> ${keys.join('\n-> ')}\n`)
        }
    }
}

/**
 * 延迟注入依赖（@Inject）
 * 
 * - design:type: 成员类型
 * - design:paramtypes: 成员所有参数类型
 * - design:returntype: 成员返回类型
 */
export function LazyInject(name?: string) {
    return function(target: Object, propertyName: string){
        let typeOrName = name || Reflect.getMetadata('design:type', target, propertyName)
        let value = ContainerExt.get(typeOrName)
        if(value){
            target[propertyName] = value
        }else{
            ContainerExt.registerLazyHandler(typeOrName, (value)=>{
                if(!value){
                    throw new Error("[LazyInject] value is null!")
                }
                target[propertyName] = value
            })
        }
    }
}


import { readFinallyAppConfig } from '../util/appUtil';

export function InjectConfig(){
    return function(target: Object, propertyName: string){
        let finallyAppConfig = readFinallyAppConfig()
        target[propertyName] = finallyAppConfig
    }
}

export function XInject(typeOrName) {
    return function (target, propertyName, index) {
        if(!isTestEnv()){
            Inject(typeOrName)(target, propertyName, index)
        }
    }
}