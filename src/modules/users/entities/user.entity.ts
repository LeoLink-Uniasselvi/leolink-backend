import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { SoftDeletable } from '@/common/entities/traits/soft-deletable.trait';
import { Named } from '@/common/entities/traits/named.trait';
import { BaseEntity } from '@/common/entities/base.entity';
import { UserRole } from '@/modules/roles/entities/user-role.entity';

@Entity('users')
export class User extends SoftDeletable(Named(BaseEntity)) {
  @Column()
  @Unique('email', ['email'])
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles?: UserRole[];

  constructor(name: string, email: string, password: string) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
  }

  updatePassword(hashedPassword: string) {
    this.password = hashedPassword;
  }
}
