import { BaseEntity } from '../base';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Idea extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({name: 'user_id'})
    userId: number;
    @Column()
    questionId: number;
    @Column()
    content: string;
    @Column()
    media: string;
    @Column()
    up: number;
    @Column()
    down: number;
    @Column()
    star: boolean;
}
