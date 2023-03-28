import { UserEntity } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { ChangeUserRoleDto } from 'src/users/dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    isAdmin(user: UserEntity): Promise<{
        isAdmin: boolean;
    }>;
    changeRole(id: string, { role }: ChangeUserRoleDto): Promise<UserEntity>;
    getSelf(user: UserEntity): Promise<any>;
    getStaff(): Promise<number[]>;
}
