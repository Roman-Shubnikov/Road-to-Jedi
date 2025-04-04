import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageTypesEnum, RoleEnum } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { ConfigService } from '@nestjs/config';
import { StorageService } from 'src/storage/storage.service';
import * as Jimp from "jimp";
import { ColorActionName } from '@jimp/plugin-color';
import * as hasha from 'hasha';
import { getTime } from '@app/utils';
import { ProductsEnum } from './enums/products.enum';
import { MoneyOperationsEnum } from './enums/money-operations.enum';
import { MarketLogEntity, PurchasedColorEntity, PurchasedIconEntity } from './entities';
import { FileEntity } from 'src/storage/entities';
import { ColorsAllEnum } from './enums';


@Injectable()
export class MarketService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(MarketLogEntity)
    private readonly marketLogRepository: Repository<MarketLogEntity>,
    @InjectRepository(PurchasedIconEntity)
    private readonly purchasedIconRepository: Repository<PurchasedIconEntity>,
    @InjectRepository(PurchasedColorEntity)
    private readonly purchasedColorRepository: Repository<PurchasedColorEntity>,
  ) {}

  async getAvalibleIcons(): Promise<string[]> {
    const icons = await this.storageService.getFolder(this.configService.get('S3_PATH_TO_AVATAR_ICONS_PNG'))
    const icons_names = icons.Contents.map(icon => icon.Key.split('/').at(-1))
    return icons_names;
  }


  async createCustomAvatar(user: UserEntity, backgroundColor: string, icon_name: string): Promise<FileEntity> {

    if(!await this.purchasedIconRepository.findOneBy({ user: { id: user.id }, icon_name })) throw new ForbiddenException('Указанная иконка не приобретена');
    if(!await this.purchasedIconRepository.findOneBy({ user: { id: user.id }, icon_name })) throw new ForbiddenException('Указанный цвет не приобретён');
  
    const size = 600;
    const avatar = new Jimp(size, size, backgroundColor)
    const icon_path = this.configService.get<string>('S3_PATH_TO_AVATAR_ICONS_PNG') + '/' + icon_name;
    const iconWithJimp = await Jimp.read(this.storageService.bucketPath + '/' + icon_path)
    iconWithJimp.color([{apply: ColorActionName.LIGHTEN, params: [size/2]}])
    avatar.composite(iconWithJimp, (size-iconWithJimp.getWidth()) / 2, (size-iconWithJimp.getHeight()) / 2)

    const newBuffer = await avatar.getBufferAsync(Jimp.MIME_PNG)
    const filename = `avagen${await hasha.async(icon_name + user.id + getTime(), {
      algorithm: 'md5',
    })}.png`;
    const path = this.configService.get<string>('S3_PATH_TO_AVATARS') + '/' + filename;
    const savedFile: FileEntity & { bucket_path?: string } = await this.storageService.upload(user, path, newBuffer, ImageTypesEnum.PNG)
    savedFile.bucket_path = this.storageService.bucketPath;
    return savedFile;
  }

  async installAvatar(user: UserEntity, hash: string): Promise<UserEntity> {
    const fileInfo = await this.storageService.save(user, hash);
    const cost = +this.configService.get<string>('MARKET_COST_INSTALL_NEW_AVATAR');
    await this.manageUserMoney(user, ProductsEnum.AVATAR, MoneyOperationsEnum['-'], cost)
    return this.usersRepository.save({ id: user.id, avatar: fileInfo })
  }
  async buyIcon(user: UserEntity, icon_name: string): Promise<PurchasedIconEntity> {
    const allIcons = await this.getAvalibleIcons();
    if (!allIcons.includes(icon_name)) throw new NotFoundException('Иконка не найдена в каталоге')
    if(await this.purchasedIconRepository.findOneBy({ user: { id: user.id }, icon_name })) throw new BadRequestException('Иконка уже куплена')
    const cost = +this.configService.get<string>('MARKET_COST_ICON');
    console.log(await this.manageUserMoney(user, ProductsEnum.ICON, MoneyOperationsEnum['-'], cost))
    return this.purchasedIconRepository.save({ user, icon_name, purchased_at: getTime() })

  }
  async buyColor(user: UserEntity, color: string): Promise<PurchasedColorEntity> {
    if(!ColorsAllEnum.includes(color)) throw new NotFoundException('Цвет не найден в каталоге')
    if(await this.purchasedColorRepository.findOneBy({ color, user: { id: user.id } })) throw new BadRequestException('Цвет уже куплен')
    const cost = +this.configService.get<string>('MARKET_COST_COLOR');
    await this.manageUserMoney(user, ProductsEnum.COLOR, MoneyOperationsEnum['-'], cost)
    return this.purchasedColorRepository.save({ user, color, purchased_at: getTime() })
  }

  async getMyIcons(user: UserEntity): Promise<{ url_to_png: string, url_to_icons: string, items: PurchasedIconEntity[]}> {
    return {
      url_to_png: this.storageService.bucketPath + '/' + this.configService.get('S3_PATH_TO_AVATAR_ICONS_PNG'),
      url_to_icons: this.storageService.bucketPath + '/' + this.configService.get('S3_PATH_TO_AVATAR_ICONS'),
      items: await this.purchasedIconRepository.find({ where: { user: { id: user.id} } })
    }
  }
  async getMyColors(user: UserEntity): Promise<{ items: PurchasedColorEntity[]}> {
    return {
      items: await this.purchasedColorRepository.find({ where: { user: { id: user.id} } })
    }
  }

  async marketLogger(user: UserEntity, product: ProductsEnum, operation: MoneyOperationsEnum, cost: number): Promise<MarketLogEntity> {
    return await this.marketLogRepository.save({
      user,
      product,
      operation,
      cost,
      operation_at: getTime(),
    })
  }

  async setNickname(user: UserEntity, nickname: string | null): Promise<UserEntity> {
    if(nickname) {
      const users_nick = await this.usersRepository.findBy({ nickname });
      if(users_nick.length) throw new ForbiddenException('Ник уже занят');
      const cost = this.configService.get('MARKET_COST_INSTALL_NEW_NICKNAME');
      await this.manageUserMoney(user, ProductsEnum.NICKNAME, MoneyOperationsEnum['-'], cost)
    }
    return this.usersRepository.save({ id: user.id, nickname });
  }
  

  async manageUserMoney(user: UserEntity, productType: ProductsEnum, operation: MoneyOperationsEnum, cost: number): Promise<UserEntity> {
    let money = user.money;
    if (operation === MoneyOperationsEnum['+']) {
      money += cost;
    } else if (operation === MoneyOperationsEnum['-']) {
      if(user.permissions < RoleEnum.SPECIAL) {
        if (money < cost) throw new PreconditionFailedException('Недостаточно средств');
        money -= cost;
      }
    }
    await this.marketLogger(user, productType, operation, cost);
    return this.usersRepository.save({ id: user.id, money });
  }

}
