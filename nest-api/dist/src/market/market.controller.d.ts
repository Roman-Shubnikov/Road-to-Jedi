import { UserEntity } from 'src/users/entities';
import { CreateCustomAvatarDto } from './dto';
import { MarketService } from './market.service';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    createCustomAvatar(user: UserEntity, body: CreateCustomAvatarDto): Promise<import("../storage/entities").FileEntity>;
    installAvatar(user: UserEntity, hash: string): Promise<UserEntity>;
    buyColor(user: UserEntity, body: any): Promise<boolean>;
    getAvalibleColors(): Promise<string[]>;
    getAvalibleIcons(): Promise<string[]>;
    buyIcon(user: UserEntity, iconName: string): Promise<boolean>;
}
