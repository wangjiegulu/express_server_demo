import { Field, ObjectType } from "type-graphql";
import { User, UserLogin } from "@dal/db/entity/account";

@ObjectType()
export class GQLLoginResp{
    @Field()
    user: User;

    @Field()
    loginInfo: UserLogin;
}