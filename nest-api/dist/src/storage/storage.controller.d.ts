/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { UserEntity } from 'src/users/entities';
import { Repository } from 'typeorm';
import { FileEntity } from './entities';
export declare class StorageController {
    private readonly storageService;
    private readonly filesRepository;
    constructor(storageService: StorageService, filesRepository: Repository<FileEntity>);
    download(filename: string): Promise<StreamableFile>;
    upload(user: UserEntity, file: Express.Multer.File): Promise<string>;
    delete(user: UserEntity, fileId: string): Promise<boolean>;
}
