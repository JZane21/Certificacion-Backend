import { AppDataSource } from "../config/dataSource";

import logger from "../logger/logger";
import { RoleRepository } from "../../domain/interfaces/roleRepository";
import { Role } from "../../domain/models/role";
import { RoleEntity } from "../entities/roleEntity";
import { showError } from "../logger/message.format";

export class RoleRepositoryImpl implements RoleRepository {
    async findById(id: string): Promise<Role> {
        const roleRepository = AppDataSource.getRepository(RoleEntity);
        const role = await roleRepository.findOne({
            where: { id },
        });
        return role ? new Role(role) : null;
    }
    async createRole(role: Role): Promise<Role> {
        const roleRepository = AppDataSource.getRepository(RoleEntity);
        const roleEntity = roleRepository.create({
            id: role.id,
            name: role.name,
            description: role.description
        });
        const roleResponse = await roleRepository.save(roleEntity);
        return new Role({
            id: roleResponse.id,
            name: roleResponse.name,
            description: roleResponse.description
        })
    }

    async deleteRole(id: string): Promise<void> {
        const repository = AppDataSource.getRepository(RoleEntity);
        try {
            const deletedRole = await repository.findOneBy({ id });

            if (!deletedRole) {
                const errorMessage: string = `RoleRepository: Error deleting role by id: ${id}.`;
                logger.error(errorMessage);
                throw new Error(`${showError(404, errorMessage)}`);
            }

            await repository.remove(deletedRole);
        } catch (error) {
            logger.error({ message: error });
            throw new Error(`${showError(404, error)}`);
        }
    }

    async updateRole(roleId: string, updateData: Partial<Role>): Promise<Role> {
        const repository = AppDataSource.getRepository(RoleEntity);
        const roleToUpdated = await repository.findOneBy({ id: roleId });

        if (!roleToUpdated) {
            logger.error(`UserRepository: Error al modificar al usuario con ID: ${roleId}.`);
            throw new Error('Usuario no encontrado');
        }

        repository.merge(roleToUpdated, updateData);
        const updatedRole = await repository.save(roleToUpdated);
        return updatedRole;
    }
}