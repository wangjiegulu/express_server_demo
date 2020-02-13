import * as uuid from 'uuid';

export let generateNumberId = ()=>{
    let millisStr = `${new Date().getTime()}`
    let prefix = millisStr.substring(millisStr.length - 8, millisStr.length - 3)
    return `${prefix}${Math.floor(Math.random() * 100000)}`
}

export let generateToken = ()=>{
    let regExp = new RegExp('-', 'g')
    return uuid().replace(regExp, '') + uuid().replace(regExp, '')
}