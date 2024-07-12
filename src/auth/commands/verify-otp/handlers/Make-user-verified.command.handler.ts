import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from 'src/auth/repositories/Auth.repository';
import { OtpRepository } from 'src/auth/repositories/Otp.repository';
import { SequelizeTransactionRunner } from 'src/common/transaction/sequelize-transaction-runner.service';
import { MakeUserVerified } from '../impl/Make-user-verified.command';

@CommandHandler(MakeUserVerified)
export class MakeUserVerifiedCommandHandler
  implements ICommandHandler<MakeUserVerified>
{
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly authRepository: AuthRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(command: MakeUserVerified): Promise<void> {
    const { verificationCode, id } = command;
    //create transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      //run the remove method of otp from OTP repository and throw our transaction in there
      await this.otpRepository.remove(verificationCode, transaction);
      // run the isVerified method of AuthRepository (this is the Repositroty of User Entity) and throw our transaction in there
      await this.authRepository.isVerified(+id, transaction);
      //comit
      this.sequelizeTransactionRunner.commitTransaction(transaction);
      return;
    } catch (error) {
      this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      throw new InternalServerErrorException('Server Error');
    }
  }
}