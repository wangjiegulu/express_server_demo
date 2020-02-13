let crypto = require('crypto')

export let decryptData = (key: any, iv: any, encryptedData: any) => {
  // base64 decode
  let sessionKey = new Buffer(key, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  let decoded: string = null
  try {
    // 解密
    let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
  } catch (err) {
    console.error("[wxUtil]decryptData, err: ", err)
    throw new Error('Decrypt Data Error!')
  }

  return decoded
}

