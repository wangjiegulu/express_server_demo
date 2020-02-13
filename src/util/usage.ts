
export class Lazy<T>{
    private t: T = null
    private initializer: ()=>T

    // private initilizeListenerList: ((T)=>void)[]

    constructor(initializer: ()=>T){
        this.initializer = initializer
    }
    get = ()=>{
        if(!this.t){
            this.t = this.initializer()
            // // 初始化通知
            // if(this.initilizeListenerList && this.initilizeListenerList.length > 0){
            //     this.initilizeListenerList.forEach(item=>{
            //         item(this.t)
            //     })
            //     this.initilizeListenerList = []
            // }
        }
        return this.t
    }

    isInitilized = ()=>{
        return null !== this.t
    }

    // addListener = (listener: (t)=>void)=>{
    //     this.initilizeListenerList.push(listener)
    // }
}