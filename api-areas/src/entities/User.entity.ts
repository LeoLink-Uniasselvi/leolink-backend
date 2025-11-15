// src/entities/User.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserArea } from './UserArea.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @OneToMany(() => UserArea, userArea => userArea.user)
    userAreas!: UserArea[];
}