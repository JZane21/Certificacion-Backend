import { PermissionDTO } from "../../app/dtos/permission.dto";
import { Permission } from "../models/permission";

export interface PermissionRepository {
  findById(id: string): Promise<Permission | null>;
  getPermissions(): Promise<Permission[]>;
  createPermission(user: Permission): Promise<PermissionDTO>;
  deletePermission(id: string): Promise<void>;
  updatePermission(PermissionId: string, updateData: Partial<Permission>): Promise<PermissionDTO>;
}
