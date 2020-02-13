export let success = (res, data = null)=>{
    return res.json(successJson(data))
}

export let successJson = (data = null)=>{
    let response = {
        code: 0,
        msg: 'success'
    }
    if(data){
        response['data'] = data
    }
    return response
}

export let fail = (res, code, msg?)=>{
    return res.json(failJson(code, msg))
}

export let failJson = (code, msg = '服务器有点不对劲')=>{
    return {
        code: code,
        msg: msg
    }
}