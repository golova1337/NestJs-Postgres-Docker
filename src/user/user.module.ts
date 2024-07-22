import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Otp } from 'src/auth/entities/otp.entity';
import { User } from 'src/auth/entities/user.entity';
import { OtpRepository } from 'src/auth/repositories/otp.repository';
import { OtpService } from 'src/auth/services/otp.service';
import { CreateAddressCommandHandler } from './commands/address/create/create-address.command.handler';
import { RemoveAddressCommandHandler } from './commands/address/remove/handlers/remove-address.command.handler';
import { UpdateAddressCommandHandler } from './commands/address/update/handler/update-address.command.handler';
import { UserController } from './controllers/user.controller';
import { Address } from './entities/Address.entity';
import { FindAllAddressQueryHandler } from './queries/address/findAllAddress/handlers/recieve-address.query.handler';
import { FindOneAddressByIdQueryHandler } from './queries/address/findOneAddressById/handlers/find-one-address-by-id.query.handler';
import { AddressRepository } from './repositories/address-repository';
import { UserAddressService } from './services/user-address.service';

export const QueryHandlers = [
  FindAllAddressQueryHandler,
  FindOneAddressByIdQueryHandler,
];

export const CommandHandlers = [
  CreateAddressCommandHandler,
  UpdateAddressCommandHandler,
  RemoveAddressCommandHandler,
];

export const UserEntities = [User, Address, Otp];

export const Services = [OtpService, UserAddressService];

export const Repositories = [AddressRepository, OtpRepository];

export const Controllers = [UserController];

@Module({
  imports: [SequelizeModule.forFeature(UserEntities), CqrsModule],
  controllers: [...Controllers],
  providers: [
    ...Repositories,
    ...QueryHandlers,
    ...CommandHandlers,
    ...Services,
  ],
})
export class UserModule {}
