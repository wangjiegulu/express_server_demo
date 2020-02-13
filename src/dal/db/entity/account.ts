import { IsEmail, IsIn, IsJSON, IsMobilePhone, IsUrl } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { enumValues } from '../../../util/typeUtil';
import { BaseEntity } from './../base';

/**
 * 用户权限
 */
export class AuthStatus{
    static NOT_LOGIN = new AuthStatus(0b0000_0001, "NOT_LOGIN")
    static NORMAL = new AuthStatus(0b0000_1111, "NORMAL")
    static ADMIN = new AuthStatus(0b1111_1111, "ADMIN")
    static DISABLE = new AuthStatus(0b0000_0000, "DISABLE")

    static values = [
        AuthStatus.NOT_LOGIN, 
        AuthStatus.NORMAL,
        AuthStatus.ADMIN,
        AuthStatus.DISABLE
    ]
    
    private constructor(
        public authCode: number,
        public name: string
    ){}

    hasAuth(authStatus: AuthStatus){
        return (this.authCode & authStatus.authCode) === authStatus.authCode
    }
    static toAuthStatus(name: String): AuthStatus{
        for(let i = 0; i < AuthStatus.values.length; i++){
            let item = AuthStatus.values[i]
            if(item.name === name){
                return item
            }
        }
        return null
    }
}

@ObjectType()
@Entity()
export class User extends BaseEntity{
    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    username: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    nickname?: string;

    @IsUrl()
    @Field({ nullable: true })
    @Column({ nullable: true })
    avatar?: string;

    @IsEmail()
    @Field({ nullable: true })
    @Column({ nullable: true })
    email?: string;

    @IsIn([null, 0, 1])
    @Field({ nullable: true })
    @Column({ nullable: true })
    gender?: number;

    @IsMobilePhone("zh-CN")
    @Field({ nullable: true })
    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    province?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    country?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    language?: string;

    @Field()
    @Column({ type: 'enum', enum: AuthStatus.values.map(it=>it.name) })
    status: String = AuthStatus.NORMAL.name;

    @Field({ nullable: true })
    @Column({ nullable: true })
    referrer?: string;
}

export enum WechatType{
    MINI_APP = 'MINI_APP'
}
@Entity()
export class UserWechat extends BaseEntity{
    @PrimaryGeneratedColumn() 
    id: number;
    @Column()
    userId: number;
    @Column()
    appId: string;
    @Column({ type: 'enum', enum: enumValues(WechatType) })
    wechatType: WechatType;
    @Column()
    openId: string;
    @Column({ nullable: true })
    unionId: string;
    @IsJSON()
    @Column({ type: 'text', nullable: true })
    detail: string;
}

export enum Platform{
    H5 = "H5",
    MINI_APP = 'MINI_APP',
    APP = 'APP'
}
@ObjectType()
@Entity()
export class UserLogin extends BaseEntity{
    @Field(type=>ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    userId: number;

    @Field()
    @Column()
    token: string;

    @Column({ type: 'enum', enum: enumValues(Platform) })
    platform: Platform;

    @Column({ nullable: true })
    sessionKey: string;

    @Field()
    @Column()
    expiredAt: Date;

    isExpired(){
        return this.expiredAt.getTime() <= new Date().getTime()
    }
}

