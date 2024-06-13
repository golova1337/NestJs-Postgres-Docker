import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RegistrationMethod } from '../enums/registMethod-enum';
import { RepeatSendCodeByPhoneConstraint } from '../decorators/class-validator/verify/repeatCode-phone';
import { RepeatSendCodeByEmailConstraint } from '../decorators/class-validator/verify/repeatCode-email';

export class RepeatSendCode {
  @ValidateIf((o) => !o.numbers)
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  @Validate(RepeatSendCodeByEmailConstraint)
  email: string;

  @ValidateIf((o) => !o.email)
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Validate(RepeatSendCodeByPhoneConstraint)
  numbers: string;

  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
