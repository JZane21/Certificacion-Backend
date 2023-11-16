import { UserRepositoryImpl } from '../../infrastructure/repositories/userRepositoryImpl';
import { UserService } from '../../app/services/userService';
import { UserController } from './userController';
import { RoleRepositoryImpl } from '../../infrastructure/repositories/roleRepositoryImpl';
import { RoleService } from '../../app/services/roleService';
import { RoleController } from './roleController';
import { AuthService } from '../../app/services/authService';
import { AuthController } from './authController';
import { EncryptImpl } from '../../infrastructure/utils/encrypt.jwt';
import { PermissionRepositoryImpl } from '../../infrastructure/repositories/permissionRepositoryImpl';
import { PermissionService } from '../../app/services/permissionService';
import { PermissionController } from './permissionController';

const encrypt = new EncryptImpl();

const roleRepository = new RoleRepositoryImpl();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository, roleRepository);
const userController = new UserController(userService);

const permissionRepository = new PermissionRepositoryImpl();
const permissionService = new PermissionService(permissionRepository, roleRepository);
const permissionController = new PermissionController(permissionService);

const authService = new AuthService(userRepository, encrypt);
const authController = new AuthController(authService);

const API: string = '/api';

export const routes = (server: any) => {
  server.use(`${API}/users`, userController.router);
  server.use(`${API}/roles`, roleController.router);
  server.use(`${API}/auth`, authController.router);
  server.use(`${API}/permissions`, permissionController.router);
};
