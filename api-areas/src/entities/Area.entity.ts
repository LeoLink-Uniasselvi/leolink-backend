import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserArea } from '../entities/UserArea.entity';

@Entity('areas')
export class Area {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    timestamp!: Date;

    @OneToMany(() => UserArea, userArea => userArea.area)
    userAreas!: UserArea[];
}