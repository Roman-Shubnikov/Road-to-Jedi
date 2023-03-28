import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleEnum } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { ConfigService } from '@nestjs/config';
export declare class UsersService implements OnApplicationBootstrap {
    private readonly configService;
    private readonly usersRepository;
    constructor(configService: ConfigService, usersRepository: Repository<UserEntity>);
    onApplicationBootstrap(): Promise<void>;
    seedAdmins(): Promise<void>;
    isAdmin(user: UserEntity): Promise<{
        isAdmin: boolean;
    }>;
    findOne(id: number): Promise<UserEntity>;
    changeRole(id: number, role: RoleEnum): Promise<UserEntity>;
    getSelf(user: UserEntity): Promise<any>;
    getStaff(): Promise<number[]>;
}
