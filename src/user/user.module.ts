import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Otp } from 'src/auth/entities/Otp.entity';
import { User } from 'src/auth/entities/User.entity';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { OtpService } from 'src/auth/services/Otp.service';
import { CreateAddressCommandHandler } from './commands/address/create/handlers/Create-address.command.handler';
import { RemoveAddressCommandHandler } from './commands/address/remove/handlers/Remove-address.command.handler';
import { UpdateAddressCommandHandler } from './commands/address/update/handler/Update-address.command.handler';
import { UserAddressController } from './controllers/User-address.controller';
import { UserAddress } from './entities/Address.entity';
import { RecieveAddressQueryHandler } from './queries/address/recieve/handlers/Recieve-address.query.handler';
import { AddressRepository } from './repository/Address-repository';
import { UserAddressService } from './services/User-address.service';

export const HandlersAddress = [
  CreateAddressCommandHandler,
  RecieveAddressQueryHandler,
  UpdateAddressCommandHandler,
  RemoveAddressCommandHandler,
];
export const Services = [OtpService, UserAddressService];
export const Repositories = [AddressRepository, OtpRepository];
export const Controllers = [UserAddressController];
@Module({
  imports: [SequelizeModule.forFeature([User, UserAddress, Otp]), CqrsModule],
  controllers: [...Controllers],
  providers: [...Repositories, ...HandlersAddress, ...Services],
})
export class UserModule {}
