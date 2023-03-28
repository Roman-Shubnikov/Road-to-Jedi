import { UserEntity } from 'src/users/entities';
import { MoneyOperationsEnum } from '../enums/money-operations.enum';
import { ProductsEnum } from '../enums/products.enum';
export declare class MarketLogEntity {
    id: number;
    user: UserEntity;
    product: ProductsEnum;
    operation: MoneyOperationsEnum;
    cost: number;
    operation_at: number;
}
