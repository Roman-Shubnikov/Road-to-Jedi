import { UserEntity } from 'src/users/entities';
export declare class PurchasedIconEntity {
    id: number;
    user: UserEntity;
    icon_name: string;
    purchased_at: number;
}
