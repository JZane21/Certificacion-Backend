import { IRoleEntity } from "../../domain/entities/IRoleEntity";
import { RoleRepository } from "../../domain/interfaces/roleRepository";
import { Role } from "../../domain/models/role";
import logger from "../../infrastructure/logger/logger";
import { CreateRoleDTO } from "../dtos/create.role.dto";

export class RoleService {
    constructor(private roleRepository: RoleRepository) { }

    async createRole(roleDto: CreateRoleDTO): Promise<Role> {
        const roleEntity: IRoleEntity = {
            name: roleDto.name,
            description: roleDto.description
        };
        const newRole = new Role(roleEntity);
        return this.roleRepository.createRole(newRole);
    }

    async getRoleById(id: string): Promise<CreateRoleDTO | null> {
        const role = await this.roleRepository.findById(id);
        if (!role) { return null; }
        const roleResponse: CreateRoleDTO = {
            id: role.id,
            name: role.name,
            description: role.description,
        }
        return roleResponse;
    }

    async deleteRoleById(roleId: string): Promise<void> {
        logger.debug(`UserService: Intentando eliminar al usuario con ID: ${roleId}`);
        await this.roleRepository.deleteRole(roleId);
    }

    async updateRoleById(roleId: string, updateData: Partial<CreateRoleDTO>): Promise<Role> {
        logger.debug(`UserService: Intentando actualizar al usuario con ID: ${roleId}`);
        return this.roleRepository.updateRole(roleId, updateData);
    }
}