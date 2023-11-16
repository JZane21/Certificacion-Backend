import { Request, Response, Router } from 'express';
import { UserDto } from '../../app/dtos/user.dto';
import { CreateUserDTO } from '../../app/dtos/create.user.dto';
import logger from '../../infrastructure/logger/logger';
import { RoleService } from '../../app/services/roleService';
import { CreateRoleDTO } from '../../app/dtos/create.role.dto';
import { showErrorResponse, showInfoResponse } from '../../infrastructure/logger/message.format';

export class RoleController {
    public router: Router;
    private roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
        this.router = Router();
        this.routes();
    }

    public async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const roleDto: CreateRoleDTO = req.body;
            const role = await this.roleService.createRole(roleDto);
            // return res.status(201).json(role);
            return showInfoResponse(201, role, res);
        } catch (error) {
            console.log(error);
            // return res.status(400).json({ message: error });
            return showErrorResponse(400, res, error);
        }
    }

    public async getRoleById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userDto = await this.roleService.getRoleById(id);

        if (!userDto) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }

        res.json(userDto);
    }

    public async deleteRole(req: Request, res: Response): Promise<Response> {
        const { roleId } = req.params;
        try {
            logger.debug(`Trying to delete role with ID: ${roleId}`);
            await this.roleService.deleteRoleById(roleId);
            logger.info(`Role deleted with ID: ${roleId} deleted succesfully`);
            return showInfoResponse(200, roleId, res);
        } catch (error) {
            logger.error(`Error while deleting role with ID: ${roleId}. Error: ${error}`);
            return showErrorResponse(500, res, error);
        }
    }

    public async updateRole(req: Request, res: Response): Promise<Response> {
        const { roleId } = req.params;
        const updateData = req.body;
        try {
            logger.debug(`Trying to update role with ID: ${roleId}`);
            const updatedRole = await this.roleService.updateRoleById(roleId, updateData);
            logger.info(`Role updated with ID: ${roleId} updated succesfully`);
            return showInfoResponse(200, { user: updatedRole }, res);
        } catch (error) {
            logger.error(`Error while updating role with ID: ${roleId}. Error: ${error}`);
            return showErrorResponse(500, res, { message: 'Error while updating role' });
        }
    };

    public routes() {
        this.router.get('/:id', this.getRoleById.bind(this));
        this.router.post('/', this.createRole.bind(this));
        this.router.delete('/:roleId', this.deleteRole.bind(this));
        this.router.put('/:roleId', this.updateRole.bind(this));
    }
}