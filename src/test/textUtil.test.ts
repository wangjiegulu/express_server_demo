import { generateToken, generateNumberId } from '@util/textUtil';

test('[generateNumberId()]generate number id', ()=>{
    let value = generateNumberId()
    expect(value).not.toBeNull()
    expect(value.length).toBeGreaterThan(0)
})

test('[generateToken()]generate token', ()=>{
    let value = generateToken()
    expect(value).not.toBeNull()
    expect(value.length).toBeGreaterThan(0)
})