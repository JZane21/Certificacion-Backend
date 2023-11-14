import { UserRepository } from "../../domain/interfaces/userRepository";
import { UserEntity } from "../entities/userEntity";
import { AppDataSource } from "../config/dataSource";
import { User } from "../../domain/models/user";
import { UserDto } from "../../app/dtos/user.dto";

export class UserRepositoryImpl implements UserRepository {
    updateUserById(id: string, user: User): Promise<UserDto> {
        throw new Error("Method not implemented.");
    }
    deleteUserById(id: string, user: User): Promise<UserDto> {
        throw new Error("Method not implemented.");
    }


    async findById(id: string): Promise<User | null> {
        const userEntity = await AppDataSource.getRepository(UserEntity).findOneBy({ id });
        return userEntity ? new User(userEntity) : null;
    }

    async createUser(user: User): Promise<User> {
        const userEntity = AppDataSource.getRepository(UserEntity).create({
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt || new Date(),
            lastLogin: user.lastLogin || null,
            roleId: user.roleId
        });

        const userResponse = await AppDataSource.getRepository(UserEntity).save(userEntity);
        return new User({
            id: userResponse.id,
            username: userResponse.username,
            email: userResponse.email,
            passwordHash: userResponse.passwordHash,
            createdAt: userResponse.createdAt,
            lastLogin: userResponse.lastLogin,
            roleId: userResponse.roleId
        })
    }
}
