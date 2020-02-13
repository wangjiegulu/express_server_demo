import { 
    EntityRepository, Repository, getRepository 
} from "typeorm";

import { User, UserWechat, UserLogin } from "../entity/account";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
}
@EntityRepository(UserWechat)
export class UserWechatRepository extends Repository<UserWechat> {

    async findByOpenId(openId: string){
        return this.createQueryBuilder()
        .where("openId = :openId", { openId: openId})
        .getOne()
    }

}
@EntityRepository(UserLogin)
export class UserLoginRepository extends Repository<UserLogin> {
    
}