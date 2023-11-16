import { IPermissionEntity } from "../../domain/entities/IPermissionEntity";
import { IUserEntity } from "../../domain/entities/IUserEntity";
import { PermissionRepository } from "../../domain/interfaces/permissionRepository";
import { RoleRepository } from "../../domain/interfaces/roleRepository";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { Permission } from "../../domain/models/permission";
import { User } from "../../domain/models/user";
import logger from "../../infrastructure/logger/logger";
import { CreatePermissionDTO } from "../dtos/create.permission.dto";
import { CreateUserDTO } from "../dtos/create.user.dto";
import { PermissionDTO } from "../dtos/permission.dto";
import { UserDto } from '../dtos/user.dto';

export class PermissionService {
  constructor(private permissionRepository: PermissionRepository, private roleRepository: RoleRepository) { }

  // get all users
  async getPermissions(): Promise<PermissionDTO[]> {
    const permissions = await this.permissionRepository.getPermissions();
    if (!permissions) {
      return [];
    }

    const permissionsResponse: PermissionDTO[] = permissions.map((permission: Permission) => {
      const permissionDto: PermissionDTO = {
        name: permission.name,
        description: permission.description
      }
      return permissionDto;
    });

    return permissionsResponse;
  }

  async getPermissionById(id: string): Promise<PermissionDTO | null> {

    const permission = await this.permissionRepository.findById(id);
    if (!permission) return null;

    const permissionResponse: PermissionDTO = {
      name: permission.name,
      description: permission.description
    }

    return permissionResponse;
  }

  async createPermission(createPermissionDto: CreatePermissionDTO): Promise<PermissionDTO> {
    const permissionEntity: IPermissionEntity = {
      name: createPermissionDto.name,
      description: createPermissionDto.description
    };
    const newPermission = new Permission(permissionEntity);

    return this.permissionRepository.createPermission(newPermission);
  }

  async deletePermission(id: string): Promise<void> {
    logger.debug(`PermissionService: Deleting permission with ID: ${id}`);
    await this.permissionRepository.deletePermission(id);
  }

  async updatePermission(id: string, updateData: Partial<CreatePermissionDTO>): Promise<PermissionDTO> {
    logger.debug(`PermissionService: Trying updating permission with ID: ${id}`);
    return this.permissionRepository.updatePermission(id, updateData);
  }
}
