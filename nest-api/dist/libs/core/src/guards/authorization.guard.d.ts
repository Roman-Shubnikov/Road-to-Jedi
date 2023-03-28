import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities';
import { Reflector } from '@nestjs/core';
export declare class AuthorizationGuard implements CanActivate {
    private readonly configService;
    private readonly usersRepository;
    private readonly reflector;
    constructor(configService: ConfigService, usersRepository: Repository<UserEntity>, reflector: Reflector);
    private secret;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
