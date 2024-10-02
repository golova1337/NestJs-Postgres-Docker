import { JwtCreationCommandHandler } from './login/handlers/jwt-creation.command.handler';
import { LogoutCommandHandler } from './logout/handlers/Logout.command.handler';
import { AdminCreationCommandHandler } from './singIn/admin/handler/admin-creation.command.handler';
import { OtpCreationAndSavingCommandHandler } from './singIn/user/handlers/otp-creation-and-saving.command.handler';
import { UserCreationCommandHandler } from './singIn/user/handlers/user-creation.command.handler';
import { OtpUpdatingAndSavingCommandHandler } from './update-otp/handlers/otp-updating-and-saving.command.handler';
import { VerifyUserCommandHandler } from './verify-user/handlers/verify-user.command.handler';

export const CommandHandlers = [
  UserCreationCommandHandler,
  JwtCreationCommandHandler,
  OtpCreationAndSavingCommandHandler,
  LogoutCommandHandler,
  VerifyUserCommandHandler,
  OtpUpdatingAndSavingCommandHandler,
  AdminCreationCommandHandler,
];
