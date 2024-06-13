import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user-cabinet.controller';
import { UserRepository } from './repository/user-repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/auth/entities/user.entity';
import { UserAddress } from './entities/address.entity';
import { AddressRepository } from './repository/address-repository';

@Module({
  imports: [SequelizeModule.forFeature([User, UserAddress])],
  controllers: [UserController],
  providers: [UserService, UserRepository, AddressRepository],
})
export class UserModule {}
