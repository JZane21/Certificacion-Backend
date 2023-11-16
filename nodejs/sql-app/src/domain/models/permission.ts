import { IPermissionEntity } from "../entities/IPermissionEntity";
import { v4 as uuidv4 } from 'uuid';

export class Permission {
  id: string;
  name: string;
  description: string;

  constructor(permissionEntity: IPermissionEntity) {
    this.id = permissionEntity.id || uuidv4();
    this.name = permissionEntity.name;
    this.description = permissionEntity.description;
  }
}