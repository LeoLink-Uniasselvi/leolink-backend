import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../entities/User.entity';
import { Area } from '../entities/Area.entity';

@Entity('user_areas')
export class UserArea {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column({ type: 'uuid' })
    areaId!: string;


    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    timestamp!: Date;

    @ManyToOne(() => User, user => user.userAreas)
    user!: User;

    @ManyToOne(() => Area, area => area.userAreas)
    area!: Area;
}