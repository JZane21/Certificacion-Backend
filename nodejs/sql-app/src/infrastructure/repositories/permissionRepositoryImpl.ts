import { AppDataSource } from "../config/dataSource";

import logger from "../logger/logger";
import { Role } from "../../domain/models/role";
import { RoleEntity } from "../entities/roleEntity";
import { showError, showInfo } from "../logger/message.format";
import { PermissionRepository } from "../../domain/interfaces/permissionRepository";
import { Permission } from "../../domain/models/permission";
import { PermissionEntity } from "../entities/permissionEntity";
import { PermissionDTO } from "../../app/dtos/permission.dto";

export class PermissionRepositoryImpl implements PermissionRepository {
  async getPermissions(): Promise<Permission[]> {
    try {
      const permissionRepository = AppDataSource.getRepository(PermissionEntity);
      const permission = await permissionRepository.find(
        { relations: ['role'] }
      );
      if (!permission) {
        logger.error(showError(404, "There is no permissions"));
        return null;
      }
      logger.info(showInfo(200, permission));
      return permission.map(permission => new Permission(permission));
    } catch (error) {
      logger.error(showError(500, error));
      return null;
    }
  }

  async findById(id: string): Promise<Permission> {
    try {
      const permissionRepository = AppDataSource.getRepository(PermissionEntity);
      const permission = await permissionRepository.findOne({
        where: { id },
      });
      if (permission) {
        logger.info(showInfo(302, permission));
      } else {
        logger.error(showError(404, "Permission not found!"));
      }
      return permission ? new Role(permission) : null;
    } catch (error) {
      logger.error(showError(404, `${this.constructor.name} - ${error}`));
      return null;
    }
  }

  async createPermission(permission: Permission): Promise<PermissionDTO> {
    try {
      const permissionRepository = AppDataSource.getRepository(PermissionEntity);
      const permissionEntity = permissionRepository.create({
        id: permission.id,
        name: permission.name,
        description: permission.description
      });
      const permissionResponse = await permissionRepository.save(permissionEntity);
      if (!permissionResponse) {
        logger.error(showError(500, "Permission could not be created!"));
        return null;
      }
      logger.info(showInfo(201, permissionResponse));
      return {
        name: permissionResponse.name,
        description: permissionResponse.description
      };
    } catch (error) {
      logger.error(showError(500, "Permission was not created!"));
      return null;
    }
  }

  async deletePermission(id: string): Promise<void> {
    const repository = AppDataSource.getRepository(PermissionEntity);
    try {
      const deletedPermission = await repository.findOneBy({ id });

      if (!deletedPermission) {
        const errorMessage: string = `permissionRepository: Error deleting permission by id: ${id}.`;
        logger.error(showError(500, errorMessage));
        throw new Error(`${showError(500, errorMessage)}`);
      }
      await repository.remove(deletedPermission);
      logger.info(showInfo(200, "Permission deleted!"));
    } catch (error) {
      logger.error(showError(500, error));
      throw new Error(`${showError(500, error)}`);
    }
  }

  async updatePermission(id: string, updateData: Partial<Permission>): Promise<PermissionDTO> {
    try {
      const repository = AppDataSource.getRepository(RoleEntity);
      const permissionToUpdated = await repository.findOneBy({ id });

      if (!permissionToUpdated) {
        logger.error(showError(404, `PermissionRepository: Error while updating permission by ID: ${id}.`));
        throw new Error('Permission not found');
      }

      repository.merge(permissionToUpdated, updateData);
      const updatedPermission = await repository.save(permissionToUpdated);

      logger.info(showInfo(200, updatedPermission));
      return {
        name: updatedPermission.name,
        description: updatedPermission.description
      };
    } catch (error) {
      logger.error(showError(500, 'Error while updating permission!'));
      throw new Error(`${error}`);
    }
  }
}
