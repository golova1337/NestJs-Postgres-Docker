import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserCommand } from '../impl/verify-user.command';
import { InternalServerErrorException } from '@nestjs/common';
import { OtpRepository } from '../../../repositories/otp.repository';
import { AuthRepository } from '../../../repositories/auth.repository';
import { SequelizeTransactionRunner } from 'src/infrastructure/database/transaction/sequelize-transaction-runner.service';

@CommandHandler(VerifyUserCommand)
export class VerifyUserCommandHandler
  implements ICommandHandler<VerifyUserCommand>
{
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly authRepository: AuthRepository,
    private readonly sequelizeTransactionRunner: SequelizeTransactionRunner,
  ) {}
  async execute(command: VerifyUserCommand): Promise<void> {
    const { verificationCode, id } = command;
    //create transaction
    const transaction =
      await this.sequelizeTransactionRunner.startTransaction();
    try {
      //run the remove method of a otp from OTP repository and throw our transaction in there
      await this.otpRepository.remove(verificationCode, transaction);
      // run the isVerified method of AuthRepository (this is the Repositroty of User Entity) and throw our transaction in there
      await this.authRepository.isVerified(id, transaction);
      //comit
      this.sequelizeTransactionRunner.commitTransaction(transaction);
      return;
    } catch (error) {
      this.sequelizeTransactionRunner.rollbackTransaction(transaction);
      throw new InternalServerErrorException('Server Error');
    }
  }
}
