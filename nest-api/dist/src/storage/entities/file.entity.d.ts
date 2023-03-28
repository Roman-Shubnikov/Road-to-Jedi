import { allowedFileTypesType } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
export declare class FileEntity {
    id: number;
    owner: UserEntity;
    path: string;
    hash: string;
    created_at: number;
    mimeType: allowedFileTypesType;
    saved: boolean;
}
