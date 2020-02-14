import { UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { IsDate } from 'class-validator';

export class BaseEntity{
    @IsDate()
    @CreateDateColumn({ nullable: false })
    createdAt: Date;

    @IsDate()
    @UpdateDateColumn({ nullable: false })
    updatedAt: Date;

}