/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { GetObjectCommandOutput, ListObjectsCommandOutput } from '@aws-sdk/client-s3';
import { Repository } from 'typeorm';
import { FileEntity } from './entities';
import { UserEntity } from 'src/users/entities';
import { allowedFileTypesType } from '@app/core/enums';
export declare class StorageService {
    private readonly configService;
    private readonly filesRepository;
    private readonly s3;
    readonly bucket: string;
    readonly bucketPath: string;
    readonly host: string;
    private readonly logger;
    constructor(configService: ConfigService, filesRepository: Repository<FileEntity>);
    getFolder(path: string): Promise<ListObjectsCommandOutput>;
    upload(user: UserEntity, path: string, buffer: Buffer, mimeType: allowedFileTypesType): Promise<FileEntity>;
    save(user: UserEntity, hash: string): Promise<FileEntity>;
    has(path: string): Promise<boolean>;
    get(filename: string): Promise<GetObjectCommandOutput>;
    getBufferObject(filename: string): Promise<Buffer>;
    delete(fileId: number): Promise<boolean>;
}
