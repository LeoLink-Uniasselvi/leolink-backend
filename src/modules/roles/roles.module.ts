import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleRepository } from './repositories/role.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import {
  AssignRoleToUserUseCase,
  CreateRoleUseCase,
  DeleteRoleUseCase,
  GetUserRolesUseCase,
  ListRolesUseCase,
  RemoveRoleFromUserUseCase,
  UpdateRoleUseCase,
} from './use-cases';
import { RoleAdapter } from './role.adapter';
import { User } from '@/modules/users/entities/user.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, User])],
  controllers: [RolesController],
  providers: [
    RoleRepository,
    UserRoleRepository,
    UserRepository,
    {
      provide: 'IRoleRepository',
      useExisting: RoleRepository,
    },
    {
      provide: 'IUserRoleRepository',
      useExisting: UserRoleRepository,
    },
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    CreateRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    ListRolesUseCase,
    AssignRoleToUserUseCase,
    RemoveRoleFromUserUseCase,
    GetUserRolesUseCase,
    RoleAdapter,
  ],
  exports: [RoleRepository, UserRoleRepository],
})
export class RolesModule {}
