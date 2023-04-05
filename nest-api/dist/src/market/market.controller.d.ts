import { UserEntity } from 'src/users/entities';
import { BuyColorDto, CreateCustomAvatarDto, SetNicknameDto } from './dto';
import { MarketService } from './market.service';
import { ConfigService } from '@nestjs/config';
export declare class MarketController {
    private readonly marketService;
    private readonly configService;
    constructor(marketService: MarketService, configService: ConfigService);
    createCustomAvatar(user: UserEntity, body: CreateCustomAvatarDto): Promise<import("../storage/entities").FileEntity>;
    installAvatar(user: UserEntity, hash: string): Promise<UserEntity>;
    buyColor(user: UserEntity, body: BuyColorDto): Promise<boolean>;
    getAvalibleColors(): Promise<{
        color: string;
    }[]>;
    getAvalibleIcons(): Promise<string[]>;
    buyIcon(user: UserEntity, iconName: string): Promise<boolean>;
    getMyIcons(user: UserEntity): Promise<{
        url_to_png: string;
        url_to_icons: string;
        items: import("./entities").PurchasedIconEntity[];
    }>;
    getMyColors(user: UserEntity): Promise<{
        items: import("./entities").PurchasedColorEntity[];
    }>;
    getPrices(): Promise<{
        nickname: number;
        new_avatar: number;
        new_color: number;
        new_icon: number;
    }>;
    setNickname(user: UserEntity, body: SetNicknameDto): Promise<boolean>;
    deleteNickname(user: UserEntity): Promise<boolean>;
}
