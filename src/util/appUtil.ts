export let getEnv = () => {
    // prod / dev
    let env = process.env.NODE_ENV
    return env ? env.trim() : env
}

export let isProdEnv = () => {
    return getEnv() === 'prod'
}

export let isTestEnv = () => {
    return getEnv() === 'test'
}

import * as path from 'path';
export let readAppConfigByName = (configName: string) => {
    let configDir = '../../config/'
    let targetConfigFile = path.join(configDir, configName)
    try {
        return require(targetConfigFile)
    } catch (e) {
        console.warn(`[appUtil]readAppConfigByName: Config file ${configName} is not exist.`)
    }
    return null
}

export let readAppConfig = () => {
    return readAppConfigByName(`app_config.js`)
}

export let readAppEnvConfig = () => {
    return readAppConfigByName(`app_config_${getEnv()}.js`)
}

export let readFinallyAppConfig = ()=>{
    let appConfig = readAppConfig()
    let appEnvConfig = readAppEnvConfig()
    return appEnvConfig ? {...appConfig, ...appEnvConfig} : appConfig
}