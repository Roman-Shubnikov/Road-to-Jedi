import { UserEntity } from 'src/users/entities';
export declare class PurchasedColorEntity {
    id: number;
    user: UserEntity;
    color: string;
    purchased_at: number;
}
