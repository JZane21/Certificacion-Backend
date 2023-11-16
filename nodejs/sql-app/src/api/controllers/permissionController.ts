import { Request, Response, Router } from 'express';
import { UserService } from '../../app/services/userService';
import { UserDto } from '../../app/dtos/user.dto';
import { CreateUserDTO } from '../../app/dtos/create.user.dto';
import logger from '../../infrastructure/logger/logger';
import { verifyTokenMiddleware } from '../middleware/verifyToken';
import { showErrorResponse, showInfoResponse } from '../../infrastructure/logger/message.format';
import { PermissionDTO } from '../../app/dtos/permission.dto';
import { PermissionService } from '../../app/services/permissionService';
import { CreatePermissionDTO } from '../../app/dtos/create.permission.dto';

export class PermissionController {
  public router: Router;
  private permissionService: PermissionService;


  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
    this.router = Router();
    this.routes();
  }

  public async getPermissions(req: Request, res: Response): Promise<void> {
    const permissions: PermissionDTO[] = await this.permissionService.getPermissions();
    res.json(permissions);
  }

  public async getPermissionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log('testing=====', req.user_id);
    const permissionDto = await this.permissionService.getPermissionById(id);

    if (!permissionDto) {
      showErrorResponse(404, res);
      return;
    }

    res.json(permissionDto);
  }

  public async createPermission(req: Request, res: Response): Promise<Response> {
    try {
      const permissionDto: CreatePermissionDTO = req.body;
      const permission = await this.permissionService.createPermission(permissionDto);
      return showInfoResponse(201, permission, res);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return showErrorResponse(400, res, error.message);
      }
      return showErrorResponse(400, res, error);

    }
  }

  public async deletePermission(req: Request, res: Response): Promise<Response> {
    const { permissionId } = req.params;
    try {
      await this.permissionService.deletePermission(permissionId);
      return showInfoResponse(200, permissionId, res);
    } catch (error) {
      return showErrorResponse(500, res, error);
    }
  }

  public async updatePermission(req: Request, res: Response): Promise<Response> {
    const { permissionId } = req.params;
    const updateData = req.body;
    try {
      const updatedPermission = await this.permissionService.updatePermission(permissionId, updateData);
      return showInfoResponse(200, { permission: updatedPermission }, res);
    } catch (error) {
      return showErrorResponse(500, res, { message: 'Error while updating permission' });
    }
  };

  public routes() {
    this.router.get('/:id', verifyTokenMiddleware, this.getPermissionById.bind(this));
    this.router.post('/', this.createPermission.bind(this));
    this.router.get('/', this.getPermissions.bind(this));
    this.router.delete('/:permissionId', this.deletePermission.bind(this));
    this.router.put('/:permissionId', this.updatePermission.bind(this));
  }
}
