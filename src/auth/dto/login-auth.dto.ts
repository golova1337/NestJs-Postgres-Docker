import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Validate,
  ValidateIf,
} from 'class-validator';
import { LoginByEmailConstraint } from '../decorators/class-validator/loginByEmail';
import { Transform } from 'class-transformer';
import { LoginByPhoneConstraint } from '../decorators/class-validator/loginByPhone';
import { RegistrationMethod } from '../enums/registMethod-enum';

export class LoginAuthDto {
  @ValidateIf((o) => !o.numbers)
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  @Validate(LoginByEmailConstraint)
  email: string;

  @ValidateIf((o) => !o.email)
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Validate(LoginByPhoneConstraint)
  numbers: string;

  @IsDefined()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/, {
    message:
      'must contain at least 1 uppercase letter, 1 number, and 1 symbol: ?=.[!/_@#$%^&()',
  })
  password: string;

  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
