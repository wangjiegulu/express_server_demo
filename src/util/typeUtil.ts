
export let enumValues = (enumType: any)=>{
    return Object.keys(enumType).map(item=> enumType[item])
}