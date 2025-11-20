import { Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Named } from '@/common/entities/traits/named.trait';
import { SoftDeletable } from '@/common/entities/traits/soft-deletable.trait';
import { UserRole } from '@/modules/roles/entities/user-role.entity';

@Entity('roles')
@Unique('role_name_unique', ['name'])
export class Role extends SoftDeletable(Named(BaseEntity)) {
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles?: UserRole[];

  constructor(name?: string) {
    super();
    if (name) {
      this.name = name;
    }
  }
}
