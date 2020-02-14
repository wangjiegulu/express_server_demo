import { InputType, Field } from "type-graphql";
import { IsJSON } from "class-validator";

@InputType()
export class GQLLoginReq{
    @Field()
    code: string;
    @Field()
    encryptedData: string;

    @IsJSON({ message: "参数 rawData 不合法" })
    @Field()
    rawData: string;
    @Field()
    signature: string;
    @Field()
    iv: string;
}