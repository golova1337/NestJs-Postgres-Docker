import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AddressController } from './controllers/user-personal-data.controller';
import { UserRepository } from './repository/user-repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/auth/entities/user.entity';
import { UserAddress } from './entities/address.entity';
import { AddressRepository } from './repository/address-repository';
import { AddressService } from './services/address.service';
import { UserPersonalDataController } from './controllers/user-address.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, UserAddress])],
  controllers: [AddressController, UserPersonalDataController],
  providers: [UserService, AddressService, UserRepository, AddressRepository],
})
export class UserModule {}
