import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities';
import { ConfigService } from '@nestjs/config';
import { StorageService } from 'src/storage/storage.service';
import { ProductsEnum } from './enums/products.enum';
import { MoneyOperationsEnum } from './enums/money-operations.enum';
import { MarketLogEntity, PurchasedColorEntity, PurchasedIconEntity } from './entities';
import { FileEntity } from 'src/storage/entities';
export declare class MarketService {
    private readonly configService;
    private readonly storageService;
    private readonly usersRepository;
    private readonly marketLogRepository;
    private readonly purchasedIconRepository;
    private readonly purchasedColorRepository;
    constructor(configService: ConfigService, storageService: StorageService, usersRepository: Repository<UserEntity>, marketLogRepository: Repository<MarketLogEntity>, purchasedIconRepository: Repository<PurchasedIconEntity>, purchasedColorRepository: Repository<PurchasedColorEntity>);
    getAvalibleIcons(): Promise<string[]>;
    createCustomAvatar(user: UserEntity, backgroundColor: string, icon_name: string): Promise<FileEntity>;
    installAvatar(user: UserEntity, hash: string): Promise<UserEntity>;
    buyIcon(user: UserEntity, icon_name: string): Promise<PurchasedIconEntity>;
    buyColor(user: UserEntity, color: string): Promise<PurchasedColorEntity>;
    getMyIcons(user: UserEntity): Promise<{
        url_to_icons: string;
        items: PurchasedIconEntity[];
    }>;
    getMyColors(user: UserEntity): Promise<{
        items: PurchasedColorEntity[];
    }>;
    marketLogger(user: UserEntity, product: ProductsEnum, operation: MoneyOperationsEnum, cost: number): Promise<MarketLogEntity>;
    manageUserMoney(user: UserEntity, productType: ProductsEnum, operation: MoneyOperationsEnum, cost: number): Promise<UserEntity>;
}
