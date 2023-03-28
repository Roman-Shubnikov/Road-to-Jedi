import { FileEntity } from 'src/storage/entities/file.entity';
export declare class UserEntity {
    id: number;
    vk_user_id: number;
    permissions: number;
    mark_day: number;
    generator: number;
    nickname: string;
    last_activity: number;
    registered: number;
    good_answers: number;
    bad_answers: number;
    total_answers: number;
    avatar_id: number;
    money: number;
    donuts: number;
    verified: number;
    flash: number;
    age: number;
    scheme: number;
    donut: number;
    diamond: number;
    publicStatus: string;
    files: FileEntity[];
    coff_active: number;
    exp: number;
    lvl: number;
    avatar: FileEntity;
}
