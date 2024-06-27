import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/auth/entities/User.entity';
import { UserAddress } from './entities/address.entity';
import { AddressRepository } from './repository/address-repository';
import { CreateAddressCommandHandler } from './commands/address/create/handlers/Create-address.command.handler';
import { UserAddressController } from './controllers/user-address.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { RecieveAddressQueryHandler } from './queries/address/recieve/handlers/Recieve-address.query.handler';
import { UpdateAddressCommandHandler } from './commands/address/update/handler/Update-address.command.handler';
import { RemoveAddressCommandHandler } from './commands/address/remove/handlers/Remove-address.command.handler';
import { OtpService } from 'src/auth/services/otp.service';
import { OtpRepository } from 'src/auth/repository/Otp.repository';
import { Otp } from 'src/auth/entities/Otp.entity';

export const HandlersAddress = [
  CreateAddressCommandHandler,
  RecieveAddressQueryHandler,
  UpdateAddressCommandHandler,
  RemoveAddressCommandHandler,
];
export const Services = [OtpService];
export const Repositories = [AddressRepository, OtpRepository];
export const Controllers = [UserAddressController];
@Module({
  imports: [SequelizeModule.forFeature([User, UserAddress, Otp]), CqrsModule],
  controllers: [...Controllers],
  providers: [...Repositories, ...HandlersAddress, ...Services],
})
export class UserModule {}
